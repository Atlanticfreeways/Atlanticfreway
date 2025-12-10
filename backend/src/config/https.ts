import fs from 'fs';
import path from 'path';
import logger from './logger';

export interface HttpsConfig {
  key: string;
  cert: string;
}

/**
 * Load HTTPS certificates
 * In production, use Let's Encrypt or similar
 */
export const loadHttpsConfig = (): HttpsConfig | null => {
  try {
    const keyPath = process.env.SSL_KEY_PATH;
    const certPath = process.env.SSL_CERT_PATH;

    if (!keyPath || !certPath) {
      logger.warn('SSL certificates not configured, running in HTTP mode');
      return null;
    }

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      logger.warn('SSL certificate files not found, running in HTTP mode');
      return null;
    }

    const key = fs.readFileSync(keyPath, 'utf-8');
    const cert = fs.readFileSync(certPath, 'utf-8');

    logger.info('✓ HTTPS certificates loaded');
    return { key, cert };
  } catch (error) {
    logger.error('Error loading HTTPS config:', error);
    return null;
  }
};

/**
 * Generate self-signed certificate for development
 * Usage: node -e "require('./src/config/https').generateSelfSignedCert()"
 */
export const generateSelfSignedCert = (): void => {
  try {
    const { execSync } = require('child_process');
    const certDir = path.join(process.cwd(), 'certs');

    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }

    const keyPath = path.join(certDir, 'key.pem');
    const certPath = path.join(certDir, 'cert.pem');

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      logger.info('Self-signed certificates already exist');
      return;
    }

    logger.info('Generating self-signed certificates...');

    execSync(
      `openssl req -x509 -newkey rsa:4096 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/CN=localhost"`,
      { stdio: 'inherit' }
    );

    logger.info('✓ Self-signed certificates generated');
  } catch (error) {
    logger.error('Error generating self-signed certificates:', error);
  }
};

export default { loadHttpsConfig, generateSelfSignedCert };
