import { Env, CheckRequest, BulkCheckRequest, ProviderResult, InputType } from '../types';
import { PROVIDERS } from '../config';
import { PROVIDER_INSTANCES } from '../providers';
import { detectInputType, sanitizeInput } from '../utils/validator';
import { shouldFilterInput } from '../utils/filter';
import { getApiKeysFromCookies } from '../utils/cookies';
import { selectProviders } from '../utils/providerSelector';
import { getCachedResult, setCachedResult } from '../utils/cache';
import { trackQuery, trackCacheHit, getFullAnalytics } from '../utils/analytics';
import { jsonResponse, errorResponse, formatCheckResponse } from './responses';

/**
 * Handles single target check
 */
export async function handleCheck(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as CheckRequest;
    const { target } = body;
    
    if (!target) {
      return errorResponse('Missing required field: target');
    }
    
    // Sanitize and detect input type
    const sanitized = sanitizeInput(target);
    const inputType = body.type || detectInputType(sanitized);
    
    if (inputType === 'unknown') {
      return errorResponse('Invalid input: unable to detect type (IP, domain, or hash)');
    }
    
    // Check if input should be filtered
    const filterCheck = shouldFilterInput(sanitized, inputType);
    if (filterCheck.filtered) {
      return jsonResponse(formatCheckResponse(
        sanitized,
        inputType,
        true,
        filterCheck.reason,
        {}
      ));
    }
    
    // Get API keys from cookies
    const cookieHeader = request.headers.get('Cookie') || '';
    const apiKeys = getApiKeysFromCookies(cookieHeader);
    
    // Handle Abuse.ch shared key
    if (apiKeys['abusech']) {
      if (!apiKeys['urlhaus']) apiKeys['urlhaus'] = apiKeys['abusech'];
      if (!apiKeys['malwarebazaar']) apiKeys['malwarebazaar'] = apiKeys['abusech'];
      if (!apiKeys['threatfox']) apiKeys['threatfox'] = apiKeys['abusech'];
    }
    
    // Select eligible providers
    const eligibleProviders = selectProviders(inputType, apiKeys);
    
    if (eligibleProviders.length === 0) {
      return errorResponse('No providers configured for this input type. Please add API keys in settings.');
    }
    
    // Query providers (with caching)
    const results: Record<string, ProviderResult> = {};
    
    for (const providerName of eligibleProviders) {
      try {
        // Check cache first
        const cached = await getCachedResult(env.CACHE, providerName, inputType, sanitized);
        
        if (cached) {
          results[providerName] = { ...cached, cached: true };
          await trackCacheHit(env.ANALYTICS, true);
          continue;
        }
        
        await trackCacheHit(env.ANALYTICS, false);
        
        // Query provider
        const provider = PROVIDER_INSTANCES[providerName];
        const apiKey = apiKeys[providerName] || '';
        
        let result: ProviderResult;
        
        if (inputType === 'ipv4' || inputType === 'ipv6') {
          if (provider.checkIP) {
            result = await provider.checkIP(sanitized, apiKey);
          } else {
            continue;
          }
        } else if (inputType === 'domain') {
          if (provider.checkDomain) {
            result = await provider.checkDomain(sanitized, apiKey);
          } else {
            continue;
          }
        } else {
          // Hash types
          if (provider.checkHash) {
            result = await provider.checkHash(sanitized, inputType, apiKey);
          } else {
            continue;
          }
        }
        
        results[providerName] = result;
        
        // Cache successful results
        if (result.status === 'success') {
          await setCachedResult(env.CACHE, providerName, inputType, sanitized, result);
        }
      } catch (error) {
        console.error(`Error querying ${providerName}:`, error);
        results[providerName] = {
          provider: providerName,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    // Track analytics
    await trackQuery(env.ANALYTICS, sanitized, inputType, eligibleProviders);
    
    // Return formatted response
    return jsonResponse(formatCheckResponse(
      sanitized,
      inputType,
      false,
      undefined,
      results
    ));
  } catch (error) {
    console.error('Check handler error:', error);
    return errorResponse('Invalid request format or internal error', 500);
  }
}

/**
 * Handles bulk check
 */
export async function handleBulkCheck(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as BulkCheckRequest;
    const { targets } = body;
    
    if (!targets || !Array.isArray(targets) || targets.length === 0) {
      return errorResponse('Missing or invalid field: targets (must be non-empty array)');
    }
    
    const results = [];
    let filtered = 0;
    
    // Process each target
    for (const target of targets) {
      const sanitized = sanitizeInput(target);
      const inputType = detectInputType(sanitized);
      
      if (inputType === 'unknown') {
        // Skip invalid inputs
        continue;
      }
      
      // Check if filtered
      const filterCheck = shouldFilterInput(sanitized, inputType);
      if (filterCheck.filtered) {
        filtered++;
        results.push(formatCheckResponse(
          sanitized,
          inputType,
          true,
          filterCheck.reason,
          {}
        ));
        continue;
      }
      
      // Get API keys
      const cookieHeader = request.headers.get('Cookie') || '';
      const apiKeys = getApiKeysFromCookies(cookieHeader);
      
      // Handle Abuse.ch shared key
      if (apiKeys['abusech']) {
        if (!apiKeys['urlhaus']) apiKeys['urlhaus'] = apiKeys['abusech'];
        if (!apiKeys['malwarebazaar']) apiKeys['malwarebazaar'] = apiKeys['abusech'];
        if (!apiKeys['threatfox']) apiKeys['threatfox'] = apiKeys['abusech'];
      }
      
      // Select providers
      const eligibleProviders = selectProviders(inputType, apiKeys);
      
      if (eligibleProviders.length === 0) {
        continue;
      }
      
      // Query providers
      const providerResults: Record<string, ProviderResult> = {};
      
      for (const providerName of eligibleProviders) {
        try {
          // Check cache
          const cached = await getCachedResult(env.CACHE, providerName, inputType, sanitized);
          
          if (cached) {
            providerResults[providerName] = { ...cached, cached: true };
            await trackCacheHit(env.ANALYTICS, true);
            continue;
          }
          
          await trackCacheHit(env.ANALYTICS, false);
          
          // Query provider
          const provider = PROVIDER_INSTANCES[providerName];
          const apiKey = apiKeys[providerName] || '';
          
          let result: ProviderResult;
          
          if (inputType === 'ipv4' || inputType === 'ipv6') {
            if (provider.checkIP) {
              result = await provider.checkIP(sanitized, apiKey);
            } else {
              continue;
            }
          } else if (inputType === 'domain') {
            if (provider.checkDomain) {
              result = await provider.checkDomain(sanitized, apiKey);
            } else {
              continue;
            }
          } else {
            if (provider.checkHash) {
              result = await provider.checkHash(sanitized, inputType, apiKey);
            } else {
              continue;
            }
          }
          
          providerResults[providerName] = result;
          
          if (result.status === 'success') {
            await setCachedResult(env.CACHE, providerName, inputType, sanitized, result);
          }
        } catch (error) {
          console.error(`Bulk check error for ${providerName}:`, error);
        }
      }
      
      // Track analytics
      await trackQuery(env.ANALYTICS, sanitized, inputType, eligibleProviders);
      
      results.push(formatCheckResponse(
        sanitized,
        inputType,
        false,
        undefined,
        providerResults
      ));
    }
    
    return jsonResponse({
      totalTargets: targets.length,
      processed: results.length,
      filtered,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    console.error('Bulk check handler error:', error);
    return errorResponse('Invalid request format or internal error', 500);
  }
}

/**
 * Handles analytics request
 */
export async function handleAnalytics(env: Env): Promise<Response> {
  try {
    const analytics = await getFullAnalytics(env.ANALYTICS);
    return jsonResponse(analytics);
  } catch (error) {
    console.error('Analytics handler error:', error);
    return errorResponse('Failed to retrieve analytics', 500);
  }
}

/**
 * Handles providers list request
 */
export async function handleProviders(request: Request): Promise<Response> {
  try {
    const cookieHeader = request.headers.get('Cookie') || '';
    const apiKeys = getApiKeysFromCookies(cookieHeader);
    
    // Handle Abuse.ch shared key
    if (apiKeys['abusech']) {
      if (!apiKeys['urlhaus']) apiKeys['urlhaus'] = apiKeys['abusech'];
      if (!apiKeys['malwarebazaar']) apiKeys['malwarebazaar'] = apiKeys['abusech'];
      if (!apiKeys['threatfox']) apiKeys['threatfox'] = apiKeys['abusech'];
    }
    
    const providersInfo = Object.entries(PROVIDERS).map(([name, config]) => ({
      name,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      ...config,
      hasApiKey: name in apiKeys || !config.requiresKey
    }));
    
    return jsonResponse({ providers: providersInfo });
  } catch (error) {
    console.error('Providers handler error:', error);
    return errorResponse('Failed to retrieve providers info', 500);
  }
}
