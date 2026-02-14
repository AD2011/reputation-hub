import { Env, AnalyticsData, InputType, ProviderName } from '../types';

/**
 * Tracks a query in analytics
 */
export async function trackQuery(
  analytics: KVNamespace,
  target: string,
  type: InputType,
  providers: string[]
): Promise<void> {
  try {
    const data = await getAnalyticsData(analytics);
    
    // Increment total queries
    data.totalQueries++;
    
    // Track by type
    if (!data.queriesByType[type]) {
      data.queriesByType[type] = 0;
    }
    data.queriesByType[type]++;
    
    // Track by provider
    for (const provider of providers) {
      if (!data.queriesByProvider[provider as ProviderName]) {
        data.queriesByProvider[provider as ProviderName] = 0;
      }
      data.queriesByProvider[provider as ProviderName]++;
    }
    
    // Track top queried targets
    const existingTarget = data.topQueriedTargets.find(t => t.target === target);
    if (existingTarget) {
      existingTarget.count++;
    } else {
      data.topQueriedTargets.push({ target, count: 1, type });
    }
    
    // Sort and keep top 10
    data.topQueriedTargets.sort((a, b) => b.count - a.count);
    data.topQueriedTargets = data.topQueriedTargets.slice(0, 10);
    
    data.lastUpdated = new Date().toISOString();
    
    await analytics.put('analytics', JSON.stringify(data));
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Tracks cache hit/miss for analytics
 */
export async function trackCacheHit(analytics: KVNamespace, hit: boolean): Promise<void> {
  try {
    const key = 'cache_stats';
    const stats = await analytics.get(key, 'json') as any || { hits: 0, misses: 0 };
    
    if (hit) {
      stats.hits++;
    } else {
      stats.misses++;
    }
    
    await analytics.put(key, JSON.stringify(stats));
  } catch (error) {
    console.error('Cache stats tracking error:', error);
  }
}

/**
 * Gets analytics data
 */
export async function getAnalyticsData(analytics: KVNamespace): Promise<AnalyticsData> {
  try {
    const data = await analytics.get('analytics', 'json') as AnalyticsData;
    
    if (data) {
      return data;
    }
  } catch (error) {
    console.error('Analytics get error:', error);
  }
  
  // Return default data if none exists
  return {
    totalQueries: 0,
    queriesByType: {} as Record<InputType, number>,
    queriesByProvider: {} as Record<ProviderName, number>,
    cacheHitRatio: 0,
    topQueriedTargets: [],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Calculates cache hit ratio
 */
export async function calculateCacheHitRatio(analytics: KVNamespace): Promise<number> {
  try {
    const stats = await analytics.get('cache_stats', 'json') as any;
    
    if (stats && (stats.hits + stats.misses) > 0) {
      return stats.hits / (stats.hits + stats.misses);
    }
  } catch (error) {
    console.error('Cache ratio calculation error:', error);
  }
  
  return 0;
}

/**
 * Gets full analytics including cache ratio
 */
export async function getFullAnalytics(analytics: KVNamespace): Promise<AnalyticsData> {
  const data = await getAnalyticsData(analytics);
  data.cacheHitRatio = await calculateCacheHitRatio(analytics);
  return data;
}
