import { Env } from './types';
import { API_ENDPOINTS } from './config';
import { handleCheck, handleBulkCheck, handleAnalytics, handleProviders } from './api/handlers';
import { jsonResponse, errorResponse } from './api/responses';
import { getHTML } from './frontend/index.html.js';

/**
 * Main Worker entry point
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Cookie'
        }
      });
    }
    
    // Serve frontend HTML
    if (path === '/') {
      return new Response(getHTML(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // API Routes
    try {
      // Single check endpoint
      if (path === API_ENDPOINTS.CHECK && request.method === 'POST') {
        return await handleCheck(request, env);
      }
      
      // Bulk check endpoint
      if (path === API_ENDPOINTS.BULK_CHECK && request.method === 'POST') {
        return await handleBulkCheck(request, env);
      }
      
      // Analytics endpoint
      if (path === API_ENDPOINTS.ANALYTICS && request.method === 'GET') {
        return await handleAnalytics(env);
      }
      
      // Providers endpoint
      if (path === API_ENDPOINTS.PROVIDERS && request.method === 'GET') {
        return await handleProviders(request);
      }
      
      // 404 for unknown routes
      return errorResponse('Not found', 404);
    } catch (error) {
      console.error('Worker error:', error);
      return errorResponse('Internal server error', 500);
    }
  }
};
