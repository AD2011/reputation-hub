/**
 * Parses cookies from a Cookie header string
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (!cookieHeader) {
    return cookies;
  }
  
  const pairs = cookieHeader.split(';');
  
  for (const pair of pairs) {
    const [key, ...valueParts] = pair.split('=');
    const trimmedKey = key.trim();
    const value = valueParts.join('=').trim();
    
    if (trimmedKey && value) {
      cookies[trimmedKey] = decodeURIComponent(value);
    }
  }
  
  return cookies;
}

/**
 * Extracts API keys from cookies
 */
export function getApiKeysFromCookies(cookieHeader: string): Record<string, string> {
  const cookies = parseCookies(cookieHeader);
  const apiKeys: Record<string, string> = {};
  
  // Extract all cookies that start with "apikey_"
  for (const [key, value] of Object.entries(cookies)) {
    if (key.startsWith('apikey_')) {
      const providerName = key.replace('apikey_', '');
      if (value && value.length > 0) {
        apiKeys[providerName] = value;
      }
    }
  }
  
  return apiKeys;
}

/**
 * Creates a Set-Cookie header value for an API key
 */
export function createApiKeyCookie(provider: string, apiKey: string, maxAge: number = 31536000): string {
  // maxAge defaults to 1 year (31536000 seconds)
  const encodedKey = encodeURIComponent(apiKey);
  return `apikey_${provider}=${encodedKey}; Path=/; Max-Age=${maxAge}; SameSite=Strict; Secure`;
}

/**
 * Creates a Set-Cookie header to delete an API key
 */
export function deleteApiKeyCookie(provider: string): string {
  return `apikey_${provider}=; Path=/; Max-Age=0; SameSite=Strict; Secure`;
}

/**
 * Gets the value of a specific cookie
 */
export function getCookie(cookieHeader: string, name: string): string | null {
  const cookies = parseCookies(cookieHeader);
  return cookies[name] || null;
}

/**
 * Checks if a provider has an API key configured
 */
export function hasApiKey(cookieHeader: string, provider: string): boolean {
  const apiKeys = getApiKeysFromCookies(cookieHeader);
  return provider in apiKeys && apiKeys[provider].length > 0;
}
