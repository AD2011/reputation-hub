import { ProviderName, InputType } from '../types';
import { PROVIDERS } from '../config';

/**
 * Selects eligible providers based on input type and available API keys
 */
export function selectProviders(
  inputType: InputType,
  availableApiKeys: Record<string, string>
): ProviderName[] {
  const eligibleProviders: ProviderName[] = [];
  
  for (const [providerName, capabilities] of Object.entries(PROVIDERS)) {
    const provider = providerName as ProviderName;
    
    // Check if provider requires an API key and if it's available
    if (capabilities.requiresKey && !availableApiKeys[provider]) {
      continue; // Skip if key is required but not provided
    }
    
    // Check if provider supports the input type
    let supported = false;
    
    switch (inputType) {
      case 'ipv4':
      case 'ipv6':
        supported = capabilities.ip;
        break;
      
      case 'domain':
        supported = capabilities.domain;
        break;
      
      case 'md5':
      case 'sha1':
      case 'sha256':
        supported = capabilities.hash;
        
        // Additional check for specific hash type support
        if (supported && capabilities.hashTypes) {
          supported = capabilities.hashTypes.includes(inputType);
        }
        break;
      
      default:
        supported = false;
    }
    
    if (supported) {
      eligibleProviders.push(provider);
    }
  }
  
  return eligibleProviders;
}

/**
 * Gets available API keys from a record of all keys
 */
export function getAvailableProviders(apiKeys: Record<string, string>): ProviderName[] {
  const available: ProviderName[] = [];
  
  for (const [provider, key] of Object.entries(apiKeys)) {
    if (key && key.length > 0) {
      available.push(provider as ProviderName);
    }
  }
  
  // Always add URLhaus since it doesn't require a key
  // if (!available.includes('urlhaus')) {
  //   available.push('urlhaus');
  // }
  
  return available;
}

/**
 * Checks if a provider supports a specific input type
 */
export function providerSupportsType(provider: ProviderName, inputType: InputType): boolean {
  const capabilities = PROVIDERS[provider];
  
  if (!capabilities) {
    return false;
  }
  
  switch (inputType) {
    case 'ipv4':
    case 'ipv6':
      return capabilities.ip;
    
    case 'domain':
      return capabilities.domain;
    
    case 'md5':
    case 'sha1':
    case 'sha256':
      if (!capabilities.hash) {
        return false;
      }
      
      // Check specific hash type support
      if (capabilities.hashTypes) {
        return capabilities.hashTypes.includes(inputType);
      }
      
      return true;
    
    default:
      return false;
  }
}

/**
 * Gets a list of providers that don't require API keys
 */
export function getNoKeyProviders(): ProviderName[] {
  const noKeyProviders: ProviderName[] = [];
  
  for (const [provider, capabilities] of Object.entries(PROVIDERS)) {
    if (!capabilities.requiresKey) {
      noKeyProviders.push(provider as ProviderName);
    }
  }
  
  return noKeyProviders;
}

/**
 * Validates that requested providers are available
 */
export function validateRequestedProviders(
  requested: ProviderName[],
  available: ProviderName[]
): { valid: ProviderName[]; invalid: ProviderName[] } {
  const valid: ProviderName[] = [];
  const invalid: ProviderName[] = [];
  
  for (const provider of requested) {
    if (available.includes(provider)) {
      valid.push(provider);
    } else {
      invalid.push(provider);
    }
  }
  
  return { valid, invalid };
}
