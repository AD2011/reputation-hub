// Provider exports
export { BaseProvider } from './base';
export { VirusTotalProvider } from './virustotal';
export { AbuseIPDBProvider } from './abuseipdb';
export { OTXProvider } from './otx';
export { IPQSProvider } from './ipqs';
export { GreyNoiseProvider } from './greynoise';
export { URLhausProvider } from './urlhaus';
export { MalwareBazaarProvider } from './malwarebazaar';
export { ThreatFoxProvider } from './threatfox';
export { ShodanProvider } from './shodan';
export { CensysProvider } from './censys';

import { VirusTotalProvider } from './virustotal';
import { AbuseIPDBProvider } from './abuseipdb';
import { OTXProvider } from './otx';
import { IPQSProvider } from './ipqs';
import { GreyNoiseProvider } from './greynoise';
import { URLhausProvider } from './urlhaus';
import { MalwareBazaarProvider } from './malwarebazaar';
import { ThreatFoxProvider } from './threatfox';
import { ShodanProvider } from './shodan';
import { CensysProvider } from './censys';
import { ThreatIntelProvider, ProviderName } from '../types';

// Provider instances
export const PROVIDER_INSTANCES: Record<ProviderName, ThreatIntelProvider> = {
  virustotal: new VirusTotalProvider(),
  abuseipdb: new AbuseIPDBProvider(),
  otx: new OTXProvider(),
  ipqs: new IPQSProvider(),
  greynoise: new GreyNoiseProvider(),
  urlhaus: new URLhausProvider(),
  malwarebazaar: new MalwareBazaarProvider(),
  threatfox: new ThreatFoxProvider(),
  shodan: new ShodanProvider(),
  censys: new CensysProvider()
};
