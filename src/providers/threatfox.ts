import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class ThreatFoxProvider extends BaseProvider {
  name = 'ThreatFox';
  supports = {
    ip: true,
    domain: true,
    hash: true,
    hashTypes: ['md5', 'sha1', 'sha256']
  };
  requiresKey = true;
  private baseUrl = 'https://threatfox-api.abuse.ch/api/v1';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    return this.queryThreatFox(ip, apiKey);
  }
  
  async checkDomain(domain: string, apiKey: string): Promise<ProviderResult> {
    return this.queryThreatFox(domain, apiKey);
  }
  
  async checkHash(hash: string, hashType: string, apiKey: string): Promise<ProviderResult> {
    return this.queryThreatFox(hash, apiKey);
  }
  
  private async queryThreatFox(ioc: string, apiKey: string): Promise<ProviderResult> {
    try {
      const formData = new FormData();
      formData.append('query', 'search_ioc');
      formData.append('search_term', ioc);
      
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: { 'API-KEY': apiKey },
        body: formData
      });
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      if (data.query_status === 'no_result') {
        return {
          provider: this.name,
          status: 'success',
          reputation: 'clean',
          details: {
            message: 'IOC not found in ThreatFox database',
            queryStatus: data.query_status
          },
          url: `https://threatfox.abuse.ch/browse.php?search=${ioc}`
        };
      }
      
      if (data.query_status !== 'ok') {
        return this.createErrorResult(`API query status: ${data.query_status}`);
      }
      
      const records = data.data || [];
      const firstRecord = records[0];
      const confidence = firstRecord?.confidence_level || 0;
      const malware = firstRecord?.malware_printable || 'Unknown Malware';
      const type = firstRecord?.ioc_type || 'Unknown Type';
      
      return {
        provider: this.name,
        status: 'success',
        reputation: 'malicious',
        score: confidence,
        details: {
          confidence: confidence,
          malware: malware,
          type: type,
          firstSeen: firstRecord?.first_seen,
          lastSeen: firstRecord?.last_seen,
          reference: firstRecord?.reference,
          reporter: firstRecord?.reporter,
          tags: firstRecord?.tags,
          recordCount: records.length
        },
        url: `https://threatfox.abuse.ch/browse.php?search=${ioc}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
