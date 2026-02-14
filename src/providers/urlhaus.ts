import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class URLhausProvider extends BaseProvider {
  name = 'URLhaus';
  supports = {
    ip: false,
    domain: true,
    hash: true,
    hashTypes: ['md5', 'sha256'] // URLhaus only supports MD5 and SHA256
  };
  requiresKey = false; // URLhaus is free and doesn't require an API key!
  private baseUrl = 'https://urlhaus-api.abuse.ch/v1';
  
  async checkDomain(domain: string, apiKey: string): Promise<ProviderResult> {
    try {
      const formData = new FormData();
      formData.append('host', domain);
      
      const response = await fetch(`${this.baseUrl}/host/`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      if (data.query_status === 'no_results') {
        return {
          provider: this.name,
          status: 'success',
          reputation: 'clean',
          details: {
            message: 'Domain not found in URLhaus database',
            queryStatus: data.query_status
          },
          url: `https://urlhaus.abuse.ch/browse.php?search=${domain}`
        };
      }
      
      return {
        provider: this.name,
        status: 'success',
        reputation: 'malicious',
        score: data.url_count || 0,
        details: {
          urlCount: data.url_count,
          blacklists: data.blacklists,
          firstSeen: data.firstseen,
          urls: data.urls?.slice(0, 5)
        },
        url: `https://urlhaus.abuse.ch/browse.php?search=${domain}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkHash(hash: string, hashType: string, apiKey: string): Promise<ProviderResult> {
    try {
      // URLhaus only supports MD5 and SHA256
      if (hashType === 'sha1') {
        return this.createUnsupportedResult('SHA1 hash');
      }
      
      const formData = new FormData();
      formData.append(`${hashType}_hash`, hash);
      
      const response = await fetch(`${this.baseUrl}/payload/`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      if (data.query_status === 'no_results') {
        return {
          provider: this.name,
          status: 'success',
          reputation: 'unknown',
          details: {
            message: 'Hash not found in URLhaus database',
            queryStatus: data.query_status
          },
          url: `https://urlhaus.abuse.ch/browse.php?search=${hash}`
        };
      }
      
      return {
        provider: this.name,
        status: 'success',
        reputation: 'malicious',
        details: {
          fileType: data.file_type,
          fileSize: data.file_size,
          signature: data.signature,
          firstSeen: data.firstseen,
          lastSeen: data.lastseen,
          urlCount: data.url_count,
          virustotal: data.virustotal,
          urls: data.urls?.slice(0, 3)
        },
        url: `https://urlhaus.abuse.ch/browse.php?search=${hash}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
