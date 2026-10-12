import { describe, it, expect } from 'vitest';
import {
  validateAdminCredentials,
  generateAdminToken,
  verifyAdminToken,
  extractAdminToken,
  ADMIN_COOKIE_NAME,
} from '../lib/adminAuth';

describe('Admin Authentication & RBAC Engine', () => {
  describe('Admin Credentials Validation', () => {
    it('should validate default admin credentials in development', () => {
      expect(validateAdminCredentials('admin', 'ZhiaiWiki2026!')).toBe(true);
      expect(validateAdminCredentials('admin ', 'ZhiaiWiki2026! ')).toBe(true); // trims whitespace
    });

    it('should reject invalid username or password', () => {
      expect(validateAdminCredentials('admin', 'wrong_password')).toBe(false);
      expect(validateAdminCredentials('root', 'ZhiaiWiki2026!')).toBe(false);
      expect(validateAdminCredentials('', '')).toBe(false);
    });
  });

  describe('Admin HMAC Token Lifecycle', () => {
    it('should generate and verify valid admin token', () => {
      const token = generateAdminToken('admin');
      expect(typeof token).toBe('string');
      expect(verifyAdminToken(token)).toBe(true);
    });

    it('should reject tampered or forged tokens', () => {
      const token = generateAdminToken('admin');
      const tampered = token.slice(0, -4) + 'zzzz';
      expect(verifyAdminToken(tampered)).toBe(false);
      expect(verifyAdminToken('invalid:token:format')).toBe(false);
      expect(verifyAdminToken(null as any)).toBe(false);
    });

    it('should reject token for non-admin username', () => {
      // Decode a valid token, modify the username part and re-encode
      const token = generateAdminToken('admin');
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [, timestamp, sig] = decoded.split(':');
      const hackerToken = Buffer.from(`hacker:${timestamp}:${sig}`).toString('base64');
      expect(verifyAdminToken(hackerToken)).toBe(false);
    });
  });

  describe('Admin Token Extraction', () => {
    it('should extract token from Authorization header', () => {
      const token = generateAdminToken('admin');
      const req = new Request('http://localhost:3000/api/admin/evidence', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      expect(extractAdminToken(req)).toBe(token);
    });

    it('should extract token from Cookie header', () => {
      const token = generateAdminToken('admin');
      const req = new Request('http://localhost:3000/api/admin/evidence', {
        headers: {
          Cookie: `${ADMIN_COOKIE_NAME}=${token}`
        }
      });
      expect(extractAdminToken(req)).toBe(token);
    });

    it('should return null when neither Cookie nor Bearer token is provided', () => {
      const req = new Request('http://localhost:3000/api/admin/evidence');
      expect(extractAdminToken(req)).toBeNull();
    });
  });
});
