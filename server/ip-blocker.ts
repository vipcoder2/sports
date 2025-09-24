import { Request, Response, NextFunction } from 'express';

// Major datacenter IP ranges (CIDR notation)
const DATACENTER_RANGES = [
  // AWS IP ranges (sample - in production, you'd want comprehensive lists)
  '3.0.0.0/8',
  '13.32.0.0/15',
  '13.224.0.0/14',
  '15.177.0.0/18',
  '18.130.0.0/16',
  '18.144.0.0/15',
  '23.20.0.0/14',
  '34.192.0.0/12',
  '52.0.0.0/11',
  '54.0.0.0/8',
  
  // Google Cloud Platform
  '34.64.0.0/10',
  '35.184.0.0/13',
  '35.192.0.0/14',
  '35.196.0.0/15',
  '35.198.0.0/16',
  '35.199.0.0/17',
  '35.200.0.0/13',
  '35.208.0.0/12',
  '35.224.0.0/12',
  '35.240.0.0/13',
  
  // Microsoft Azure
  '13.64.0.0/11',
  '13.96.0.0/13',
  '13.104.0.0/14',
  '20.0.0.0/6',
  '23.96.0.0/13',
  '40.64.0.0/10',
  '52.224.0.0/11',
  '104.40.0.0/13',
  '137.116.0.0/14',
  '138.91.0.0/16',
  
  // DigitalOcean
  '104.131.0.0/16',
  '107.170.0.0/16',
  '128.199.0.0/16',
  '138.197.0.0/16',
  '139.59.0.0/16',
  '142.93.0.0/16',
  '143.110.0.0/16',
  '146.190.0.0/16',
  '147.182.0.0/16',
  '157.230.0.0/16',
  '159.65.0.0/16',
  '159.89.0.0/16',
  '164.90.0.0/16',
  '165.227.0.0/16',
  '167.71.0.0/16',
  '167.99.0.0/16',
  '174.138.0.0/16',
  '178.62.0.0/16',
  '188.166.0.0/16',
  '188.226.0.0/16',
  '206.189.0.0/16',
  '209.97.128.0/18',
  
  // Linode
  '23.239.0.0/16',
  '45.33.0.0/16',
  '45.56.0.0/16',
  '45.79.0.0/16',
  '50.116.0.0/16',
  '66.175.208.0/20',
  '69.164.192.0/19',
  '72.14.176.0/20',
  '74.207.224.0/19',
  '96.126.96.0/19',
  '97.107.128.0/18',
  '103.3.60.0/22',
  '106.187.32.0/19',
  '109.74.192.0/20',
  '139.162.0.0/16',
  '172.104.0.0/15',
  '173.230.128.0/19',
  '173.255.192.0/18',
  '176.58.96.0/19',
  '185.3.92.0/22',
  '192.155.80.0/20',
  '198.58.96.0/19',
  '212.71.224.0/19',
  
  // Vultr
  '45.32.0.0/16',
  '45.76.0.0/16',
  '45.77.0.0/16',
  '66.42.32.0/19',
  '104.156.224.0/19',
  '108.61.128.0/17',
  '149.28.0.0/16',
  '207.148.64.0/18',
  '216.128.128.0/17',
  
  // Hetzner
  '5.9.0.0/16',
  '78.46.0.0/15',
  '88.99.0.0/16',
  '94.130.0.0/16',
  '116.202.0.0/15',
  '135.181.0.0/16',
  '136.243.0.0/16',
  '138.201.0.0/16',
  '142.132.128.0/17',
  '144.76.0.0/16',
  '148.251.0.0/16',
  '159.69.0.0/16',
  '176.9.0.0/16',
  '178.63.0.0/16',
  '188.40.0.0/16',
  '195.201.0.0/16',
  '213.133.96.0/19',
  
  // OVH
  '5.39.0.0/16',
  '5.135.0.0/16',
  '5.196.0.0/16',
  '37.187.0.0/16',
  '37.59.0.0/16',
  '46.105.0.0/16',
  '51.254.0.0/15',
  '51.68.0.0/16',
  '51.75.0.0/16',
  '51.77.0.0/16',
  '51.79.0.0/16',
  '51.81.0.0/16',
  '51.83.0.0/16',
  '51.89.0.0/16',
  '51.91.0.0/16',
  '51.159.0.0/16',
  '51.161.0.0/16',
  '51.178.0.0/16',
  '51.195.0.0/16',
  '54.36.0.0/16',
  '54.37.0.0/16',
  '87.98.128.0/17',
  '91.121.0.0/16',
  '94.23.0.0/16',
  '137.74.0.0/16',
  '141.94.0.0/16',
  '141.95.0.0/16',
  '145.239.0.0/16',
  '146.59.0.0/16',
  '147.135.0.0/16',
  '149.202.0.0/16',
  '151.80.0.0/16',
  '152.228.128.0/17',
  '158.69.0.0/16',
  '164.132.0.0/16',
  '176.31.0.0/16',
  '178.32.0.0/15',
  '185.45.160.0/22',
  '188.165.0.0/16',
  '193.70.0.0/17',
  '198.27.64.0/18',
  '198.100.144.0/20',
  '213.186.32.0/19',
  '213.251.128.0/18',
];

// Known datacenter ASNs (Autonomous System Numbers)
const DATACENTER_ASNS = [
  14618, // Amazon
  15169, // Google
  8075,  // Microsoft
  14061, // DigitalOcean
  63949, // Linode
  20473, // Choopa (Vultr)
  24940, // Hetzner
  16276, // OVH
  13335, // Cloudflare
  36351, // SoftLayer (IBM)
  32613, // Rackspace
];

// Convert CIDR to IP range
function cidrToRange(cidr: string): { start: number, end: number } {
  const [ip, prefixLength] = cidr.split('/');
  const prefix = parseInt(prefixLength, 10);
  const mask = (-1 << (32 - prefix)) >>> 0;
  const ipNum = ipToNumber(ip);
  const start = (ipNum & mask) >>> 0;
  const end = (start + (Math.pow(2, 32 - prefix) - 1)) >>> 0;
  return { start, end };
}

// Convert IP address to number
function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(part => parseInt(part, 10));
  return ((parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

// Check if IP is in datacenter range
function isDatacenterIP(ip: string): boolean {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.')) {
    return false; // Local/private IPs are allowed
  }

  const ipNum = ipToNumber(ip);
  
  for (const cidr of DATACENTER_RANGES) {
    const { start, end } = cidrToRange(cidr);
    if (ipNum >= start && ipNum <= end) {
      return true;
    }
  }
  
  return false;
}

// Get real IP address from request (considering proxies)
function getRealIP(req: Request): string {
  // Check various headers for the real IP
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const clientIP = req.headers['x-client-ip'];
  const forwarded = req.headers['forwarded'];
  
  // x-forwarded-for can contain multiple IPs, take the first one
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    const firstIP = ips.split(',')[0].trim();
    return firstIP;
  }
  
  if (realIP && typeof realIP === 'string') {
    return realIP;
  }
  
  if (clientIP && typeof clientIP === 'string') {
    return clientIP;
  }
  
  if (forwarded && typeof forwarded === 'string') {
    const match = forwarded.match(/for=([^;,]+)/);
    if (match && match[1]) {
      return match[1].replace(/"/g, '');
    }
  }
  
  return req.socket.remoteAddress || req.ip || 'unknown';
}

// Rate limiting for failed attempts
const failedAttempts = new Map<string, { count: number, lastAttempt: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const attempt = failedAttempts.get(ip);
  if (!attempt) return false;
  
  const now = Date.now();
  if (now - attempt.lastAttempt > BLOCK_DURATION) {
    failedAttempts.delete(ip);
    return false;
  }
  
  return attempt.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const attempt = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempt.count += 1;
  attempt.lastAttempt = Date.now();
  failedAttempts.set(ip, attempt);
}

// Main middleware function
export function blockDatacenterIPs(req: Request, res: Response, next: NextFunction): void {
  const clientIP = getRealIP(req);
  const userAgent = req.headers['user-agent'] || '';
  const path = req.path;
  
  // Log request for monitoring
  console.log(`[IP-BLOCK] ${req.method} ${path} from ${clientIP} - ${userAgent}`);
  
  // Check if IP is rate limited
  if (isRateLimited(clientIP)) {
    console.log(`[IP-BLOCK] Rate limited IP: ${clientIP}`);
    recordFailedAttempt(clientIP);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Your IP has been temporarily blocked due to suspicious activity',
      retryAfter: Math.ceil(BLOCK_DURATION / 1000)
    });
    return;
  }
  
  // Check for suspicious user agents (common bot patterns)
  const suspiciousUAPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http-client/i,
    /okhttp/i,
    /node\.js/i,
    /axios/i,
    /postman/i,
    /insomnia/i,
  ];
  
  const isSuspiciousUA = suspiciousUAPatterns.some(pattern => pattern.test(userAgent));
  
  // Check if IP is from datacenter
  if (isDatacenterIP(clientIP)) {
    console.log(`[IP-BLOCK] Blocked datacenter IP: ${clientIP} - User-Agent: ${userAgent}`);
    recordFailedAttempt(clientIP);
    
    res.status(403).json({
      error: 'Access denied',
      message: 'Access from datacenter IPs is not permitted',
      code: 'DATACENTER_BLOCKED'
    });
    return;
  }
  
  // Block suspicious user agents from accessing stream endpoints
  if (isSuspiciousUA && (path.includes('/api/stream') || path.includes('/api/match'))) {
    console.log(`[IP-BLOCK] Blocked suspicious user agent: ${clientIP} - ${userAgent}`);
    recordFailedAttempt(clientIP);
    
    res.status(403).json({
      error: 'Access denied',
      message: 'Access not permitted for automated clients',
      code: 'USER_AGENT_BLOCKED'
    });
    return;
  }
  
  // Additional checks for stream endpoints
  if (path.includes('/api/stream')) {
    // Check for missing or suspicious referrer
    const referrer = req.headers.referer || req.headers.referrer;
    if (!referrer || (!referrer.includes(req.headers.host || '') && !referrer.includes('localhost'))) {
      console.log(`[IP-BLOCK] Blocked request without proper referrer: ${clientIP} - Referrer: ${referrer}`);
      recordFailedAttempt(clientIP);
      
      res.status(403).json({
        error: 'Access denied',
        message: 'Direct access to streams is not permitted',
        code: 'INVALID_REFERRER'
      });
      return;
    }
  }
  
  next();
}

// Clean up failed attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, attempt] of failedAttempts.entries()) {
    if (now - attempt.lastAttempt > BLOCK_DURATION * 2) {
      failedAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes