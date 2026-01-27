import stringSimilarity from 'string-similarity';

/**
 * Service to resolve vendor names using regex patterns and fuzzy matching
 */

// Known services registry with patterns
const SERVICE_REGISTRY = [
    { name: 'Netflix', patterns: [/netflix/i] },
    { name: 'Spotify', patterns: [/spotify/i] },
    { name: 'Amazon Prime', patterns: [/amazon\s*prime/i, /prime\s*membership/i] },
    { name: 'Disney+', patterns: [/disney\s*\+|disneyplus/i] },
    { name: 'HBO Max', patterns: [/hbo\s*max|hbomax/i] },
    { name: 'YouTube Premium', patterns: [/youtube\s*(premium|music)/i] },
    { name: 'Apple', patterns: [/apple/i, /itunes/i] },
    { name: 'Google', patterns: [/google\s*(one|workspace|drive|storage)/i] },
    { name: 'Microsoft 365', patterns: [/microsoft\s*365|office\s*365/i] },
    { name: 'Adobe', patterns: [/adobe/i, /creative\s*cloud/i] },
    { name: 'Dropbox', patterns: [/dropbox/i] },
    { name: 'Slack', patterns: [/slack/i] },
    { name: 'Zoom', patterns: [/zoom/i] },
    { name: 'Canva', patterns: [/canva/i] },
    { name: 'Notion', patterns: [/notion/i] },
    { name: 'GitHub', patterns: [/github/i] },
    { name: 'LinkedIn', patterns: [/linkedin/i] },
    { name: 'Grammarly', patterns: [/grammarly/i] },
    { name: 'ChatGPT', patterns: [/chatgpt|openai/i] },
    { name: 'Claude', patterns: [/claude|anthropic/i] },
    { name: 'Midjourney', patterns: [/midjourney/i] },
    { name: 'Vercel', patterns: [/vercel/i] },
    { name: 'Heroku', patterns: [/heroku/i] },
    { name: 'DigitalOcean', patterns: [/digital\s*ocean/i] },
    { name: 'AWS', patterns: [/amazon\s*web\s*services|aws/i] },
    { name: 'PlayStation', patterns: [/playstation|ps\s*plus/i] },
    { name: 'Xbox', patterns: [/xbox/i] },
    { name: 'Nintendo', patterns: [/nintendo/i] },
    { name: 'Hulu', patterns: [/hulu/i] },
    { name: 'Peacock', patterns: [/peacock/i] },
    { name: 'Paramount+', patterns: [/paramount\s*\+/i] },
];

// Extract just the names for fuzzy matching
const KNOWN_SERVICE_NAMES = SERVICE_REGISTRY.map(s => s.name);

/**
 * Resolve vendor from text inputs
 * @param {string} senderName - Sender name (e.g., "Netflix, Inc.")
 * @param {string} senderEmail - Sender email (e.g., "info@mailer.netflix.com")
 * @param {string} subject - Email subject
 * @returns {Object} - { name, method, confidence }
 */
export const resolveVendor = (senderName = '', senderEmail = '', subject = '') => {
    // 1. Precise Regex Matching
    const combinedText = `${senderName} ${senderEmail} ${subject}`;

    for (const service of SERVICE_REGISTRY) {
        for (const pattern of service.patterns) {
            if (pattern.test(combinedText)) {
                return {
                    name: service.name,
                    method: 'REGEX_MATCH',
                    confidence: 1.0
                };
            }
        }
    }

    // 2. Domain Extraction & Clean up
    let potentialName = '';

    // Try to extract from email domain
    if (senderEmail) {
        const domainMatch = senderEmail.match(/@(?:.*\.)?([a-z0-9-]+)\.[a-z]+$/i);
        if (domainMatch && domainMatch[1]) {
            const domainPart = domainMatch[1];
            // Skip generic domains
            if (!['gmail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'protonmail'].includes(domainPart.toLowerCase())) {
                potentialName = domainPart;
            }
        }
    }

    // Fallback to sender name if no good domain
    if (!potentialName && senderName) {
        potentialName = senderName.split(/[<@(]/)[0].trim().replace(/['"]/g, '');
    }

    if (!potentialName) return null;

    // 3. Fuzzy Matching against known list
    const matches = stringSimilarity.findBestMatch(potentialName, KNOWN_SERVICE_NAMES);
    const bestMatch = matches.bestMatch;

    if (bestMatch.rating > 0.4) {
        return {
            name: bestMatch.target,
            method: 'FUZZY_MATCH',
            confidence: bestMatch.rating
        };
    }

    // 4. Return the cleaned potential name if it looks valid
    // Capitalize first letter
    const formattedName = potentialName.charAt(0).toUpperCase() + potentialName.slice(1);

    return {
        name: formattedName,
        method: 'EXTRACTION',
        confidence: 0.3 // Low confidence as it's just an extraction
    };
};
