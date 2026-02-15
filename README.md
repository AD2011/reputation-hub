# 🛡️ Reputation Hub

> A powerful threat intelligence platform for checking IP, Domain, and Hash reputation across 8 major providers.

## 🌟 Features

- 🔍 **Multi-Provider Support**: Query 8 threat intel providers simultaneously
- 🔑 **BYOK (Bring Your Own Key)**: API keys are stored securely in your browser (HTTP-only cookies)
- 🎯 **Smart Detection**: Auto-detects IPs (IPv4/IPv6), Domains, and Hashes (MD5/SHA1/SHA256)
- 🚀 **Bulk Processing**: Check multiple targets at once (mixed types supported)
- 💾 **Intelligent Caching**: 24-hour server-side caching via Cloudflare Workers KV to minimize API usage
- 🌓 **Dark/Light Mode**: Automatic system preference sync with manual toggle
- 📊 **Analytics**: Track your query volume and cache hit ratios
- 📥 **Export**: Download results as CSV or JSON

## 📋 Supported Providers

| Provider | IP | Domain | Hash | API Key | Free Tier |
|----------|:--:|:--:|:--:|:--:|-----------|
| **VirusTotal** | ✅ | ✅ | ✅ | Required | 500/day |
| **AbuseIPDB** | ✅ | ❌ | ❌ | Required | 1000/day |
| **AlienVault OTX** | ✅ | ✅ | ✅ | Required | Unlimited |
| **IPQualityScore** | ✅ | ✅ | ❌ | Required | 5000/mo |
| **GreyNoise** | ✅ | ❌ | ❌ | Required | Community |
| **URLhaus** | ❌ | ✅ | ✅ | **No** | Unlimited |
| **Shodan** | ✅ | ✅ | ❌ | Required | Limited |
| **Censys** | ✅ | ✅ | ❌ | Required | 250/mo |

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (`npm install -g wrangler`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reputation-hub.git
   cd reputation-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

4. **Create KV Namespaces**
   You need two KV namespaces: one for caching results and one for analytics.
   ```bash
   # Create production namespaces
   npx wrangler kv namespace create CACHE
   npx wrangler kv namespace create ANALYTICS

   # Create preview namespaces (for development)
   npx wrangler kv namespace create CACHE --preview
   npx wrangler kv namespace create ANALYTICS --preview
   ```

5. **Update Configuration**
   Edit `wrangler.toml` and update the `id` and `preview_id` fields with the IDs generated in the previous step.

### Development

Run the local development server:
```bash
npm run dev
```
Visit `http://localhost:8787` to see the app running.

### Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```
Your app will be live at `https://reputation-hub.<your-subdomain>.workers.dev`.

## 📖 Usage Guide

### 1. Configure API Keys
Click the **⚙️ API Keys** button in the header. Enter your API keys for the providers you want to use. Keys are saved in your browser's cookies and are never stored on our servers.

> **Note:** URLhaus is enabled by default and requires no API key.

### 2. Single Check
- Enter an IP address, Domain, or Hash in the input field.
- Click **🔍 Check Reputation**.
- View detailed results from all configured providers.

### 3. Bulk Check
- Switch to **Bulk** mode.
- Enter multiple targets (one per line).
- Click **🔍 Check Reputation**.
- Results will populate in a list below.

### 4. Export Results
After running a check, use the **📥 Export JSON** or **📊 Export CSV** buttons to download your data.

## 🔒 Security & Privacy

- **Client-Side Keys**: API keys are stored in secure, HTTP-only cookies on your client. They are sent to the Worker only when making requests.
- **No Persistence**: We do not store your API keys in any database.
- **HTTPS Enforced**: All communication is encrypted via TLS.
- **Local Filtering**: Private IPs (e.g., `192.168.x.x`) and local domains are filtered client-side to prevent unnecessary API calls.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
