import { ThreatIntelProvider, ProviderResult } from '../types';

/**
 * Base class for threat intelligence providers
 */
export abstract class BaseProvider implements ThreatIntelProvider {
  abstract name: string;
  abstract supports: {
    ip: boolean;
    domain: boolean;
    hash: boolean;
    hashTypes?: string[];
  };
  abstract requiresKey: boolean;
  
  /**
   * Creates a standardized error result
   */
  protected createErrorResult(error: string): ProviderResult {
    return {
      provider: this.name,
      status: 'error',
      error
    };
  }
  
  /**
   * Creates a standardized "no key" result
   */
  protected createNoKeyResult(): ProviderResult {
    return {
      provider: this.name,
      status: 'no_key',
      error: 'API key not configured for this provider'
    };
  }
  
  /**
   * Creates a standardized "unsupported" result
   */
  protected createUnsupportedResult(type: string): ProviderResult {
    return {
      provider: this.name,
      status: 'unsupported',
      error: `${this.name} does not support ${type} lookups`
    };
  }
  
  /**
   * Makes an HTTP request with error handling
   */
  protected async makeRequest(url: string, options?: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'ReputationHub/1.0',
          ...options?.headers
        }
      });
      
      return response;
    } catch (error) {
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Parses JSON response with error handling
   */
  protected async parseJSON(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch (error) {
      throw new Error('Invalid JSON response from provider');
    }
  }
  
  // Optional methods to be implemented by subclasses
  checkIP?(ip: string, apiKey: string): Promise<ProviderResult>;
  checkDomain?(domain: string, apiKey: string): Promise<ProviderResult>;
  checkHash?(hash: string, hashType: string, apiKey: string): Promise<ProviderResult>;
}
