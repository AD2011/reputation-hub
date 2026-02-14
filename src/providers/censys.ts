import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class CensysProvider extends BaseProvider {
  name = 'Censys';
  supports = {
    ip: true,
    domain: true,
    hash: false
  };
  requiresKey = true;
  private baseUrl = 'https://search.censys.io/api/v2';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    try {
      // API key format should be "id:secret"
      const [apiId, apiSecret] = apiKey.includes(':') ? apiKey.split(':') : [apiKey, ''];
      
      if (!apiSecret) {
        return this.createErrorResult('Censys API key should be in format: API_ID:API_SECRET');
      }
      
      const credentials = btoa(`${apiId}:${apiSecret}`);
      
      const response = await this.makeRequest(`${this.baseUrl}/hosts/${ip}`, {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        return this.createErrorResult('Invalid API credentials');
      }
      
      if (response.status === 404) {
        return {
          provider: this.name,
          status: 'success',
          reputation: 'unknown',
          details: {
            message: 'IP not found in Censys database'
          },
          url: `https://search.censys.io/hosts/${ip}`
        };
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      return {
        provider: this.name,
        status: 'success',
        reputation: 'unknown',
        details: {
          services: data.result?.services?.slice(0, 5)?.map((s: any) => ({
            port: s.port,
            serviceName: s.service_name,
            transport: s.transport_protocol
          })) || [],
          protocols: data.result?.protocols || [],
          location: data.result?.location,
          autonomousSystem: data.result?.autonomous_system,
          lastUpdated: data.result?.last_updated_at
        },
        url: `https://search.censys.io/hosts/${ip}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkDomain(domain: string, apiKey: string): Promise<ProviderResult> {
    try {
      const [apiId, apiSecret] = apiKey.includes(':') ? apiKey.split(':') : [apiKey, ''];
      
      if (!apiSecret) {
        return this.createErrorResult('Censys API key should be in format: API_ID:API_SECRET');
      }
      
      const credentials = btoa(`${apiId}:${apiSecret}`);
      
      // Censys domain search via certificates
      const response = await this.makeRequest(
        `${this.baseUrl}/certificates/search?q=names:${encodeURIComponent(domain)}&per_page=5`,
        {
          headers: {
            'Authorization': `Basic ${credentials}`
          }
        }
      );
      
      if (response.status === 401 || response.status === 403) {
        return this.createErrorResult('Invalid API credentials');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      return {
        provider: this.name,
        status: 'success',
        reputation: 'unknown',
        details: {
          certificateCount: data.result?.total || 0,
          certificates: data.result?.hits?.slice(0, 3)?.map((cert: any) => ({
            fingerprint: cert.fingerprint_sha256,
            names: cert.names,
            issuer: cert.parsed?.issuer,
            validFrom: cert.parsed?.validity?.start,
            validTo: cert.parsed?.validity?.end
          })) || []
        },
        url: `https://search.censys.io/search?resource=certificates&q=names:${domain}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
