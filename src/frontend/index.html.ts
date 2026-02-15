// HTML template export function
export function getHTML(): string {
  return HTML_CONTENT;
}

const CSS_CONTENT = `
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --bg-tertiary: #e0e0e0;
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --border-color: #d0d0d0;
    --accent-blue: #2563eb;
    --accent-blue-hover: #1d4ed8;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --clean: #10b981;
    --suspicious: #f59e0b;
    --malicious: #ef4444;
}

[data-theme="dark"] {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --bg-tertiary: #404040;
    --text-primary: #e0e0e0;
    --text-secondary: #a0a0a0;
    --border-color: #404040;
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --bg-tertiary: #404040;
        --text-primary: #e0e0e0;
        --text-secondary: #a0a0a0;
        --border-color: #404040;
    }
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    transition: background 0.3s, color 0.3s;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--border-color);
}

header h1 {
    font-size: 2rem;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
}

.btn-large {
    padding: 12px 24px;
    font-size: 16px;
}

.btn-primary {
    background: var(--accent-blue);
    color: white;
}

.btn-primary:hover {
    background: var(--accent-blue-hover);
}

.btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background: var(--bg-tertiary);
}

.input-section {
    background: var(--bg-secondary);
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 30px;
}

.mode-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.mode-btn {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}

.mode-btn.active {
    background: var(--accent-blue);
    color: white;
    border-color: var(--accent-blue);
}

.input-field {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--bg-primary);
    color: var(--text-primary);
    margin-bottom: 10px;
}

.input-hint {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 20px;
}

textarea.input-field {
    resize: vertical;
    font-family: monospace;
}

.active-providers {
    margin: 20px 0;
    padding: 15px;
    background: var(--bg-primary);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.action-buttons {
    display: flex;
    gap: 10px;
}

#results-section {
    margin-top: 30px;
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.export-buttons {
    display: flex;
    gap: 10px;
}

.result-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
}

.provider-result {
    background: var(--bg-primary);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    border-left: 4px solid var(--border-color);
}

.provider-result.clean {
    border-left-color: var(--clean);
}

.provider-result.suspicious {
    border-left-color: var(--suspicious);
}

.provider-result.malicious {
    border-left-color: var(--malicious);
}

.provider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.badge-cached {
    background: #8b5cf6;
    color: white;
}

.badge-clean {
    background: var(--clean);
    color: white;
}

.badge-suspicious {
    background: var(--suspicious);
    color: white;
}

.badge-malicious {
    background: var(--danger);
    color: white;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    overflow-y: auto;
}

.modal-content {
    background: var(--bg-primary);
    max-width: 600px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 12px;
    position: relative;
}

.modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.tutorial-content ol {
    margin: 20px 0;
}

.tutorial-content li {
    margin: 15px 0;
}

.provider-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 15px 0;
}

.provider-links a {
    padding: 6px 12px;
    background: var(--accent-blue);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 13px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
}

.api-key-input {
    margin-bottom: 20px;
}

.api-key-input label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.api-key-input input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.api-key-input small {
    display: block;
    margin-top: 5px;
    color: var(--text-secondary);
    font-size: 12px;
}

.loader {
    border: 4px solid var(--bg-tertiary);
    border-top: 4px solid var(--accent-blue);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

#loading {
    text-align: center;
    padding: 40px;
}

footer {
    text-align: center;
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
    color: var(--text-secondary);
    font-size: 14px;
}

footer a {
    color: var(--accent-blue);
    text-decoration: none;
}

@media (max-width: 768px) {
    header {
        flex-direction: column;
        gap: 15px;
    }
    
    .header-actions {
        width: 100%;
        justify-content: center;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .results-header {
        flex-direction: column;
        gap: 15px;
    }
}
`;

const JS_CONTENT = `
let currentMode = 'single';
let lastResults = null;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadActiveProviders();
    checkFirstVisit();
});

function initializeTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function checkFirstVisit() {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        showTutorial();
    }
}

function showTutorial() {
    document.getElementById('tutorial-modal').style.display = 'block';
}

function closeTutorial() {
    const dontShow = document.getElementById('dont-show-again').checked;
    if (dontShow) {
        localStorage.setItem('hasVisited', 'true');
    }
    document.getElementById('tutorial-modal').style.display = 'none';
}

async function loadActiveProviders() {
    try {
        const response = await fetch('/api/providers');
        const data = await response.json();
        
        const container = document.getElementById('active-providers');
        const withKeys = data.providers.filter(p => p.hasApiKey);
        const withoutKeys = data.providers.filter(p => !p.hasApiKey);
        
        let html = '<div><strong>Active Providers (' + withKeys.length + '/8):</strong><br>';
        html += withKeys.map(p => p.requiresKey ? '✅ ' + p.displayName : '✅ ' + p.displayName + ' (no key needed)').join(', ') || 'None';
        if (withoutKeys.length > 0) {
            html += '<br><small style="color: var(--text-secondary)">⚠️ Not configured: ' + withoutKeys.map(p => p.displayName).join(', ') + '</small>';
        }
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Failed to load providers:', error);
    }
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('single-input').style.display = mode === 'single' ? 'block' : 'none';
    document.getElementById('bulk-input').style.display = mode === 'bulk' ? 'block' : 'none';
    document.getElementById('single-mode-btn').classList.toggle('active', mode === 'single');
    document.getElementById('bulk-mode-btn').classList.toggle('active', mode === 'bulk');
}

async function checkReputation() {
    const btn = document.getElementById('check-btn');
    btn.disabled = true;
    btn.textContent = 'Checking...';
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-section').style.display = 'none';
    
    try {
        if (currentMode === 'single') {
            await checkSingle();
        } else {
            await checkBulk();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '🔍 Check Reputation';
        document.getElementById('loading').style.display = 'none';
    }
}

async function checkSingle() {
    const target = document.getElementById('target-input').value.trim();
    if (!target) {
        alert('Please enter an IP, domain, or hash');
        return;
    }
    
    const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
    });
    
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.message || 'Unknown error occurred');
    }
    
    lastResults = [data];
    displayResults([data]);
}

async function checkBulk() {
    const text = document.getElementById('bulk-input-area').value.trim();
    if (!text) {
        alert('Please enter targets (one per line)');
        return;
    }
    
    const targets = text.split('\\n').map(t => t.trim()).filter(t => t.length > 0);
    
    const response = await fetch('/api/check/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets })
    });
    
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.message || 'Unknown error occurred');
    }
    
    lastResults = data.results;
    displayResults(data.results);
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    if (!results || !Array.isArray(results)) {
        console.error('Invalid results format:', results);
        return;
    }
    
    results.forEach(result => {
        if (!result) return;

        const resultType = result.type ? result.type.toUpperCase() : 'UNKNOWN';
        const timestamp = result.timestamp ? new Date(result.timestamp).toLocaleString() : 'N/A';

        const card = document.createElement('div');
        card.className = 'result-card';
        
        let html = '<div class="result-header">';
        html += '<div><h3>' + (result.target || 'Unknown Target') + '</h3><small>' + resultType + ' • ' + timestamp + '</small></div>';
        html += '<div>';
        if (result.summary) {
            const risk = result.summary.overallRisk;
            html += '<span class="badge badge-' + (risk === 'high' ? 'malicious' : risk === 'medium' ? 'suspicious' : 'clean') + '">' + risk.toUpperCase() + ' RISK</span>';
        }
        html += '</div></div>';
        
        if (result.filtered) {
            html += '<p>' + result.filterReason + '</p>';
        } else if (result.results) {
            if (result.summary) {
                html += '<p style="margin-bottom: 15px;"><strong>' + result.summary.recommendations + '</strong></p>';
            }
            
            for (const [provider, providerResult] of Object.entries(result.results)) {
                const rep = providerResult.reputation || 'unknown';
                html += '<div class="provider-result ' + rep + '">';
                html += '<div class="provider-header">';
                html += '<strong>' + providerResult.provider + '</strong>';
                html += '<div>';
                if (providerResult.cached) {
                    html += '<span class="badge badge-cached">💾 Cached</span> ';
                }
                if (providerResult.status === 'success') {
                    html += '<span class="badge badge-' + rep + '">' + rep.toUpperCase() + '</span>';
                }
                html += '</div></div>';
                
                if (providerResult.status === 'success' && providerResult.details) {
                    html += '<div style="font-size: 13px; color: var(--text-secondary); margin-top: 8px;">';
                    const details = providerResult.details;
                    if (details.malicious !== undefined) html += 'Malicious: ' + details.malicious + ' ';
                    if (details.abuseScore !== undefined) html += 'Abuse Score: ' + details.abuseScore + '% ';
                    if (details.pulseCount !== undefined) html += 'Pulses: ' + details.pulseCount + ' ';
                    if (details.fraudScore !== undefined) html += 'Fraud Score: ' + details.fraudScore + ' ';
                    html += '</div>';
                }
                
                if (providerResult.url) {
                    html += '<div style="margin-top: 8px;"><a href="' + providerResult.url + '" target="_blank" style="color: var(--accent-blue); font-size: 13px;">View Details →</a></div>';
                }
                
                if (providerResult.error) {
                    html += '<div style="color: var(--danger); font-size: 13px; margin-top: 8px;">' + providerResult.error + '</div>';
                }
                
                html += '</div>';
            }
        }
        
        card.innerHTML = html;
        container.appendChild(card);
    });
    
    document.getElementById('results-section').style.display = 'block';
}

function clearResults() {
    document.getElementById('target-input').value = '';
    document.getElementById('bulk-input-area').value = '';
    document.getElementById('results-section').style.display = 'none';
    lastResults = null;
}

function exportJSON() {
    if (!lastResults) return;
    const blob = new Blob([JSON.stringify(lastResults, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'reputation-results.json');
}

function exportCSV() {
    if (!lastResults) return;
    let csv = 'Target,Type,Overall Risk,Filtered,Timestamp\\n';
    
    lastResults.forEach(result => {
        csv += '"' + result.target + '",';
        csv += result.type + ',';
        csv += (result.summary?.overallRisk || 'N/A') + ',';
        csv += result.filtered + ',';
        csv += result.timestamp + '\\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, 'reputation-results.csv');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function showSettings() {
    const response = await fetch('/api/providers');
    const data = await response.json();
    
    const form = document.getElementById('api-keys-form');
    form.innerHTML = '';
    
    data.providers.forEach(provider => {
        const div = document.createElement('div');
        div.className = 'api-key-input';
        
        const currentKey = getCookie('apikey_' + provider.name) || '';
        
        let html = '<label>' + provider.displayName;
        if (!provider.requiresKey) {
            html += ' <span style="color: var(--success);">(No key required)</span>';
        }
        html += '</label>';
        
        if (provider.requiresKey) {
            html += '<input type="password" id="key-' + provider.name + '" value="' + currentKey + '" placeholder="Enter API key...">';
            html += '<small>Supports: ' + (provider.ip ? 'IP ' : '') + (provider.domain ? 'Domain ' : '') + (provider.hash ? 'Hash ' : '');
            html += '| Free tier: ' + (provider.freeTier || 'N/A') + '</small>';
            if (provider.registrationUrl) {
                html += '<br><small><a href="' + provider.registrationUrl + '" target="_blank">Get API Key →</a></small>';
            }
        } else {
            html += '<small>' + provider.description + '</small>';
        }
        
        div.innerHTML = html;
        form.appendChild(div);
    });
    
    document.getElementById('settings-modal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

function saveApiKeys() {
    const providers = ['virustotal', 'abuseipdb', 'otx', 'ipqs', 'greynoise', 'shodan', 'censys'];
    
    providers.forEach(provider => {
        const input = document.getElementById('key-' + provider);
        if (input) {
            const value = input.value.trim();
            if (value) {
                setCookie('apikey_' + provider, value, 365);
            } else {
                deleteCookie('apikey_' + provider);
            }
        }
    });
    
    alert('API keys saved!');
    loadActiveProviders();
    closeSettings();
}

async function showAnalytics() {
    document.getElementById('analytics-modal').style.display = 'block';
    const content = document.getElementById('analytics-content');
    content.innerHTML = 'Loading...';
    
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        
        let html = '<div style="margin: 20px 0;">';
        html += '<h3>Total Queries: ' + data.totalQueries + '</h3>';
        html += '<p>Cache Hit Ratio: ' + (data.cacheHitRatio * 100).toFixed(1) + '%</p>';
        
        if (data.queriesByProvider && Object.keys(data.queriesByProvider).length > 0) {
            html += '<h4 style="margin-top: 20px;">Queries by Provider:</h4><ul>';
            for (const [provider, count] of Object.entries(data.queriesByProvider)) {
                html += '<li>' + provider + ': ' + count + '</li>';
            }
            html += '</ul>';
        }
        
        if (data.topQueriedTargets && data.topQueriedTargets.length > 0) {
            html += '<h4 style="margin-top: 20px;">Top Queried Targets:</h4><ul>';
            data.topQueriedTargets.forEach(t => {
                html += '<li>' + t.target + ' (' + t.type + '): ' + t.count + ' queries</li>';
            });
            html += '</ul>';
        }
        
        html += '</div>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = 'Failed to load analytics: ' + error.message;
    }
}

function closeAnalytics() {
    document.getElementById('analytics-modal').style.display = 'none';
}

function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Strict; Secure';
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
`;

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reputation Hub - Threat Intelligence Platform</title>
    <style>
${CSS_CONTENT}
    </style>
</head>
<body>
    <div id="tutorial-modal" class="modal">
        <div class="modal-content">
            <h2>👋 Welcome to Reputation Hub!</h2>
            <div class="tutorial-content">
                <h3>🚀 Quick Start Guide</h3>
                <ol>
                    <li><strong>Configure API Keys</strong><br>Click "⚙️ API Keys" to add your provider keys. URLhaus works without an API key!</li>
                    <li><strong>Enter Your Target</strong><br>
                        • IP: <code>1.1.1.1</code> or <code>2606:4700::1111</code><br>
                        • Domain: <code>example.com</code><br>
                        • Hash: <code>44d88612fea8a8f36de82e1278abb02f</code>
                    </li>
                    <li><strong>Check Reputation</strong><br>Click "Check Reputation" to query configured providers</li>
                    <li><strong>Bulk Processing</strong><br>Switch to "Bulk" mode for multiple targets (one per line)</li>
                </ol>
                
                <h3>📚 Provider Registration Links</h3>
                <div class="provider-links">
                    <a href="https://www.virustotal.com/gui/join-us" target="_blank">VirusTotal</a>
                    <a href="https://www.abuseipdb.com/api" target="_blank">AbuseIPDB</a>
                    <a href="https://otx.alienvault.com/api" target="_blank">AlienVault OTX</a>
                    <a href="https://www.ipqualityscore.com/create-account" target="_blank">IPQualityScore</a>
                    <a href="https://www.greynoise.io/viz/account/api-key" target="_blank">GreyNoise</a>
                    <a href="https://account.shodan.io/register" target="_blank">Shodan</a>
                    <a href="https://search.censys.io/register" target="_blank">Censys</a>
                </div>
                
                <label class="checkbox-label">
                    <input type="checkbox" id="dont-show-again"> Don't show this again
                </label>
            </div>
            <button onclick="closeTutorial()" class="btn btn-primary">Get Started</button>
        </div>
    </div>

    <div id="settings-modal" class="modal">
        <div class="modal-content">
            <h2>⚙️ API Key Configuration</h2>
            <div id="api-keys-form"></div>
            <div class="modal-actions">
                <button onclick="saveApiKeys()" class="btn btn-primary">Save All Keys</button>
                <button onclick="closeSettings()" class="btn btn-secondary">Close</button>
            </div>
        </div>
    </div>

    <div id="analytics-modal" class="modal">
        <div class="modal-content">
            <h2>📊 Usage Analytics</h2>
            <div id="analytics-content">Loading...</div>
            <button onclick="closeAnalytics()" class="btn btn-primary">Close</button>
        </div>
    </div>

    <div class="container">
        <header>
            <h1>🛡️ Reputation Hub</h1>
            <div class="header-actions">
                <button onclick="showSettings()" class="btn btn-sm" title="API Keys">⚙️ API Keys</button>
                <button onclick="showAnalytics()" class="btn btn-sm" title="Analytics">📊 Analytics</button>
                <button onclick="showTutorial()" class="btn btn-sm" title="Help">❓ Help</button>
                <button onclick="toggleTheme()" class="btn btn-sm" id="theme-toggle" title="Toggle theme">🌓</button>
            </div>
        </header>

        <main>
            <div class="input-section">
                <div class="mode-selector">
                    <button onclick="setMode('single')" class="mode-btn active" id="single-mode-btn">Single</button>
                    <button onclick="setMode('bulk')" class="mode-btn" id="bulk-mode-btn">Bulk</button>
                </div>

                <div id="single-input" class="input-mode">
                    <input type="text" id="target-input" placeholder="Enter IP, Domain, or Hash..." class="input-field">
                    <p class="input-hint">Examples: 1.1.1.1, example.com, 44d88612fea8a8f36de82e1278abb02f</p>
                </div>

                <div id="bulk-input" class="input-mode" style="display:none;">
                    <textarea id="bulk-input-area" placeholder="Enter one IP, Domain, or Hash per line...
Example:
1.1.1.1
example.com
44d88612fea8a8f36de82e1278abb02f" rows="10" class="input-field"></textarea>
                </div>

                <div id="active-providers" class="active-providers"></div>

                <div class="action-buttons">
                    <button onclick="checkReputation()" class="btn btn-primary btn-large" id="check-btn">🔍 Check Reputation</button>
                    <button onclick="clearResults()" class="btn btn-secondary">🗑️ Clear</button>
                </div>
            </div>

            <div id="results-section" style="display:none;">
                <div class="results-header">
                    <h2>Results</h2>
                    <div class="export-buttons">
                        <button onclick="exportJSON()" class="btn btn-sm">📥 Export JSON</button>
                        <button onclick="exportCSV()" class="btn btn-sm">📊 Export CSV</button>
                    </div>
                </div>
                <div id="results-container"></div>
            </div>

            <div id="loading" style="display:none;">
                <div class="loader"></div>
                <p>Querying threat intelligence providers...</p>
            </div>
        </main>

        <footer>
            <p>Reputation Hub v1.0.0 | <a href="https://github.com" target="_blank">GitHub</a> | Powered by 8 Threat Intel Providers</p>
        </footer>
    </div>

    <script>
${JS_CONTENT}
    </script>
</body>
</html>`;
