import { 
  SEVERITY_ORDER, 
  SEVERITY_LABEL, 
  SEVERITY_COLOR, 
  priorityBand, 
  DISASTER_TYPES, 
  ASSET_TYPES, 
  isStaff, 
  isAdmin, 
  VERIFICATION_LABEL 
} from '@/lib/rbac';
import type { Role, Severity, VerificationStatus } from '@/lib/types';

describe('lib/rbac', () => {
  describe('SEVERITY_ORDER', () => {
    it('should have correct order values', () => {
      expect(SEVERITY_ORDER.unclear).toBe(0);
      expect(SEVERITY_ORDER.minor).toBe(1);
      expect(SEVERITY_ORDER.moderate).toBe(2);
      expect(SEVERITY_ORDER.severe).toBe(3);
      expect(SEVERITY_ORDER.critical).toBe(4);
    });

    it('should have all severity levels', () => {
      const severities: Severity[] = ['unclear', 'minor', 'moderate', 'severe', 'critical'];
      severities.forEach(sev => {
        expect(SEVERITY_ORDER[sev]).toBeDefined();
      });
    });
  });

  describe('SEVERITY_LABEL', () => {
    it('should have correct labels', () => {
      expect(SEVERITY_LABEL.unclear).toBe('Unclear');
      expect(SEVERITY_LABEL.minor).toBe('Minor');
      expect(SEVERITY_LABEL.moderate).toBe('Moderate');
      expect(SEVERITY_LABEL.severe).toBe('Severe');
      expect(SEVERITY_LABEL.critical).toBe('Critical');
    });
  });

  describe('SEVERITY_COLOR', () => {
    it('should have correct color classes', () => {
      expect(SEVERITY_COLOR.unclear).toBe('bg-gray-500');
      expect(SEVERITY_COLOR.minor).toBe('bg-green-500');
      expect(SEVERITY_COLOR.moderate).toBe('bg-yellow-500');
      expect(SEVERITY_COLOR.severe).toBe('bg-orange-500');
      expect(SEVERITY_COLOR.critical).toBe('bg-red-500');
    });
  });

  describe('priorityBand', () => {
    it('should return Low for score < 35', () => {
      expect(priorityBand(0)).toEqual({ label: 'Low', color: 'bg-green-500' });
      expect(priorityBand(20)).toEqual({ label: 'Low', color: 'bg-green-500' });
      expect(priorityBand(34)).toEqual({ label: 'Low', color: 'bg-green-500' });
    });

    it('should return Medium for score 35-59', () => {
      expect(priorityBand(35)).toEqual({ label: 'Medium', color: 'bg-yellow-500' });
      expect(priorityBand(50)).toEqual({ label: 'Medium', color: 'bg-yellow-500' });
      expect(priorityBand(59)).toEqual({ label: 'Medium', color: 'bg-yellow-500' });
    });

    it('should return High for score 60-79', () => {
      expect(priorityBand(60)).toEqual({ label: 'High', color: 'bg-orange-500' });
      expect(priorityBand(70)).toEqual({ label: 'High', color: 'bg-orange-500' });
      expect(priorityBand(79)).toEqual({ label: 'High', color: 'bg-orange-500' });
    });

    it('should return Critical for score >= 80', () => {
      expect(priorityBand(80)).toEqual({ label: 'Critical', color: 'bg-red-500' });
      expect(priorityBand(90)).toEqual({ label: 'Critical', color: 'bg-red-500' });
      expect(priorityBand(100)).toEqual({ label: 'Critical', color: 'bg-red-500' });
    });

    it('should handle null/undefined score', () => {
      expect(priorityBand(null)).toEqual({ label: '—', color: 'bg-gray-400' });
      expect(priorityBand(undefined)).toEqual({ label: '—', color: 'bg-gray-400' });
    });
  });

  describe('DISASTER_TYPES', () => {
    it('should contain expected disaster types', () => {
      expect(DISASTER_TYPES).toContain('flood');
      expect(DISASTER_TYPES).toContain('earthquake');
      expect(DISASTER_TYPES).toContain('cyclone');
      expect(DISASTER_TYPES).toContain('fire');
      expect(DISASTER_TYPES).toContain('landslide');
      expect(DISASTER_TYPES).toContain('drought');
      expect(DISASTER_TYPES).toContain('industrial');
      expect(DISASTER_TYPES).toContain('building_collapse');
      expect(DISASTER_TYPES).toContain('other');
    });

    it('should have 9 disaster types', () => {
      expect(DISASTER_TYPES).toHaveLength(9);
    });
  });

  describe('ASSET_TYPES', () => {
    it('should contain expected asset types', () => {
      expect(ASSET_TYPES).toContain('building');
      expect(ASSET_TYPES).toContain('road');
      expect(ASSET_TYPES).toContain('bridge');
      expect(ASSET_TYPES).toContain('vehicle');
      expect(ASSET_TYPES).toContain('utility');
      expect(ASSET_TYPES).toContain('farmland');
      expect(ASSET_TYPES).toContain('other');
    });

    it('should have 7 asset types', () => {
      expect(ASSET_TYPES).toHaveLength(7);
    });
  });

  describe('isStaff', () => {
    it('should return true for authority role', () => {
      expect(isStaff('authority')).toBe(true);
    });

    it('should return true for analyst role', () => {
      expect(isStaff('analyst')).toBe(true);
    });

    it('should return true for admin role', () => {
      expect(isStaff('admin')).toBe(true);
    });

    it('should return false for citizen role', () => {
      expect(isStaff('citizen')).toBe(false);
    });

    it('should return false for volunteer role', () => {
      expect(isStaff('volunteer')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isStaff(null)).toBe(false);
      expect(isStaff(undefined)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      expect(isAdmin('admin')).toBe(true);
    });

    it('should return false for authority role', () => {
      expect(isAdmin('authority')).toBe(false);
    });

    it('should return false for analyst role', () => {
      expect(isAdmin('analyst')).toBe(false);
    });

    it('should return false for citizen role', () => {
      expect(isAdmin('citizen')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isAdmin(null)).toBe(false);
      expect(isAdmin(undefined)).toBe(false);
    });
  });

  describe('VERIFICATION_LABEL', () => {
    it('should have correct labels', () => {
      expect(VERIFICATION_LABEL.unverified).toBe('Unverified');
      expect(VERIFICATION_LABEL.verified).toBe('Verified');
      expect(VERIFICATION_LABEL.rejected).toBe('Rejected');
      expect(VERIFICATION_LABEL.needs_review).toBe('Needs Review');
      expect(VERIFICATION_LABEL.escalated).toBe('Escalated');
    });

    it('should have all verification statuses', () => {
      const statuses: VerificationStatus[] = ['unverified', 'verified', 'rejected', 'needs_review', 'escalated'];
      statuses.forEach(status => {
        expect(VERIFICATION_LABEL[status]).toBeDefined();
      });
    });
  });
});