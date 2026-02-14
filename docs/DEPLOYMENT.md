# 🚀 Deployment Guide

This guide will walk you through deploying **Reputation Hub** to Cloudflare Workers.

## Prerequisites

1.  **Cloudflare Account**: [Sign up here](https://dash.cloudflare.com/sign-up).
2.  **Node.js**: Ensure you have Node.js (v16 or later) installed.
3.  **Wrangler CLI**: Install the Cloudflare Workers CLI globally:
    ```bash
    npm install -g wrangler
    ```

## Step 1: Login to Cloudflare

Authenticate Wrangler with your Cloudflare account:

```bash
wrangler login
```

A browser window will open asking you to authorize Wrangler. Click **Allow**.

## Step 2: Create KV Namespaces

Reputation Hub uses Cloudflare Workers KV for caching API responses and storing analytics data. You need to create two namespaces: `CACHE` and `ANALYTICS`.

Run the following commands in your terminal and **save the IDs** output by each command.

**1. Create Production Namespaces:**

```bash
wrangler kv:namespace create CACHE
# Output: { binding = "CACHE", id = "<YOUR_CACHE_ID>" }

wrangler kv:namespace create ANALYTICS
# Output: { binding = "ANALYTICS", id = "<YOUR_ANALYTICS_ID>" }
```

**2. Create Preview Namespaces (Optional but recommended for `wrangler dev`):**

```bash
wrangler kv:namespace create CACHE --preview
# Output: { binding = "CACHE", preview_id = "<YOUR_CACHE_PREVIEW_ID>" }

wrangler kv:namespace create ANALYTICS --preview
# Output: { binding = "ANALYTICS", preview_id = "<YOUR_ANALYTICS_PREVIEW_ID>" }
```

## Step 3: Configure `wrangler.toml`

Open the `wrangler.toml` file in the root of your project and update the `id` and `preview_id` fields with the values you obtained in Step 2.

```toml
name = "reputation-hub"
main = "src/index.ts"
compatibility_date = "2024-01-01"
node_compat = true

# KV namespace for caching
[[kv_namespaces]]
binding = "CACHE"
id = "<YOUR_CACHE_ID>" 
preview_id = "<YOUR_CACHE_PREVIEW_ID>"

# KV namespace for analytics
[[kv_namespaces]]
binding = "ANALYTICS"
id = "<YOUR_ANALYTICS_ID>"
preview_id = "<YOUR_ANALYTICS_PREVIEW_ID>"

[vars]
CACHE_TTL = "86400"  # 24 hours in seconds
ENVIRONMENT = "production"
VERSION = "1.0.0"

[env.dev]
name = "reputation-hub-dev"
vars = { ENVIRONMENT = "development" }
```

## Step 4: Deploy

Deploy your application to Cloudflare's global network:

```bash
npm run deploy
```

Wait for the deployment to complete. Wrangler will output your worker's URL (e.g., `https://reputation-hub.<your-subdomain>.workers.dev`).

## Step 5: Verify Deployment

Visit the URL provided in the output. You should see the Reputation Hub interface.

**Troubleshooting:**

-   **500 Internal Server Error**: Check the logs using `wrangler tail` to see what went wrong.
-   **KV Errors**: Ensure the namespace IDs in `wrangler.toml` match the ones created in Step 2.
-   **API Errors**: Make sure you have configured your API keys correctly in the settings menu.

## Continuous Deployment (Optional)

You can set up GitHub Actions to automatically deploy your worker on push to the `main` branch. See Cloudflare's [documentation on GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/github-actions/) for more details.
