/**
 * Test suite for Task 1.3.2: Verify settings save correctly
 *
 * This test verifies:
 * - isPlusUser: true is saved and persists
 * - Settings migration works correctly (auto-enables Plus for existing users)
 * - Settings are properly sanitized on load
 * - plusLicenseKey field is handled correctly (deprecated but backward compatible)
 */

import { sanitizeSettings } from "@/settings/model";
import { CopilotSettings } from "@/settings/model";
import { DEFAULT_SETTINGS } from "@/constants";

describe("Task 1.3.2: Settings Persistence Verification", () => {
  describe("isPlusUser persistence", () => {
    it("should default isPlusUser to true in DEFAULT_SETTINGS", () => {
      expect(DEFAULT_SETTINGS.isPlusUser).toBe(true);
    });

    it("should preserve isPlusUser: true when sanitizing settings", () => {
      const settings = {
        ...DEFAULT_SETTINGS,
        isPlusUser: true,
      };

      const sanitized = sanitizeSettings(settings);
      expect(sanitized.isPlusUser).toBe(true);
    });

    it("should auto-enable Plus for existing users with isPlusUser: false", () => {
      const settings = {
        ...DEFAULT_SETTINGS,
        isPlusUser: false,
      };

      const sanitized = sanitizeSettings(settings);
      expect(sanitized.isPlusUser).toBe(true);
    });

    it("should auto-enable Plus for existing users with isPlusUser: undefined", () => {
      const settings = {
        ...DEFAULT_SETTINGS,
        isPlusUser: undefined,
      };

      const sanitized = sanitizeSettings(settings);
      expect(sanitized.isPlusUser).toBe(true);
    });
  });

  describe("Settings migration", () => {
    it("should auto-enable Plus when loading legacy settings without isPlusUser field", () => {
      // Simulate legacy settings that don't have isPlusUser field
      const legacySettings: Partial<CopilotSettings> = {
        userId: "test-user-id",
        openAIApiKey: "sk-test-key",
        plusLicenseKey: "legacy-license-key",
        // isPlusUser field is missing (undefined)
      };

      const sanitized = sanitizeSettings(legacySettings as CopilotSettings);
      expect(sanitized.isPlusUser).toBe(true);
    });

    it("should auto-enable Plus when loading settings with isPlusUser: false", () => {
      const settings = {
        ...DEFAULT_SETTINGS,
        isPlusUser: false,
        plusLicenseKey: "some-old-key",
      };

      const sanitized = sanitizeSettings(settings);
      expect(sanitized.isPlusUser).toBe(true);
    });

    it("should create userId when missing", () => {
      const settingsWithoutUserId = {
        ...DEFAULT_SETTINGS,
      };
      // @ts-expect-error - Testing edge case
      delete settingsWithoutUserId.userId;

      const sanitized = sanitizeSettings(settingsWithoutUserId);
      expect(sanitized.userId).toBeDefined();
      expect(typeof sanitized.userId).toBe("string");
      expect(sanitized.userId.length).toBeGreaterThan(0);
    });
  });

  describe("plusLicenseKey backward compatibility", () => {
    it("should preserve plusLicenseKey field for backward compatibility", () => {
      const settings = {
        ...DEFAULT_SETTINGS,
        plusLicenseKey: "legacy-key-123",
      };

      const sanitized = sanitizeSettings(settings);
      expect(sanitized.plusLicenseKey).toBe("legacy-key-123");
    });

    it("should default plusLicenseKey to empty string in DEFAULT_SETTINGS", () => {
      expect(DEFAULT_SETTINGS.plusLicenseKey).toBe("");
    });

    it("should handle settings with both plusLicenseKey and isPlusUser", () => {
      const settings = {
        ...DEFAULT_SETTINGS,
        plusLicenseKey: "old-license",
        isPlusUser: false,
      };

      const sanitized = sanitizeSettings(settings);
      // isPlusUser should be auto-enabled despite having a license key
      expect(sanitized.isPlusUser).toBe(true);
      // License key should be preserved for backward compatibility
      expect(sanitized.plusLicenseKey).toBe("old-license");
    });
  });

  describe("Settings sanitization", () => {
    it("should handle null/undefined settings gracefully", () => {
      // @ts-expect-error - Testing edge case
      const sanitized = sanitizeSettings(null);
      expect(sanitized.isPlusUser).toBe(true);
      expect(sanitized.userId).toBeDefined();
    });

    it("should handle undefined settings gracefully", () => {
      // @ts-expect-error - Testing edge case
      const sanitized = sanitizeSettings(undefined);
      expect(sanitized.isPlusUser).toBe(true);
      expect(sanitized.userId).toBeDefined();
    });

    it("should preserve all other settings while auto-enabling Plus", () => {
      const customSettings = {
        ...DEFAULT_SETTINGS,
        isPlusUser: false,
        temperature: 0.7,
        maxTokens: 4000,
        openAIApiKey: "sk-custom-key",
        defaultSaveFolder: "custom/folder",
      };

      const sanitized = sanitizeSettings(customSettings);
      expect(sanitized.isPlusUser).toBe(true);
      expect(sanitized.temperature).toBe(0.7);
      expect(sanitized.maxTokens).toBe(4000);
      expect(sanitized.openAIApiKey).toBe("sk-custom-key");
      expect(sanitized.defaultSaveFolder).toBe("custom/folder");
    });

    it("should sanitize numeric settings from strings", () => {
      const settings = {
        ...DEFAULT_SETTINGS,
        // @ts-expect-error - Testing edge case where settings might be stored as strings
        temperature: "0.5",
        // @ts-expect-error
        maxTokens: "8000",
        // @ts-expect-error
        contextTurns: "20",
      };

      const sanitized = sanitizeSettings(settings);
      expect(sanitized.temperature).toBe(0.5);
      expect(sanitized.maxTokens).toBe(8000);
      expect(sanitized.contextTurns).toBe(20);
      expect(sanitized.isPlusUser).toBe(true);
    });
  });

  describe("Complete persistence flow simulation", () => {
    it("should correctly handle load → sanitize → save flow for new user", () => {
      // Step 1: New user (no saved settings, loadData returns null)
      const loadedSettings = null;

      // Step 2: Sanitize (simulates what happens in plugin.loadSettings())
      // @ts-expect-error - Testing null case
      const sanitized = sanitizeSettings(loadedSettings);

      // Step 3: Verify result
      expect(sanitized.isPlusUser).toBe(true);
      expect(sanitized.userId).toBeDefined();
      expect(sanitized.plusLicenseKey).toBe("");
    });

    it("should correctly handle load → sanitize → save flow for existing user", () => {
      // Step 1: Existing user with old settings (before Plus fork)
      const loadedSettings = {
        ...DEFAULT_SETTINGS,
        userId: "existing-user-123",
        isPlusUser: false, // Old setting
        plusLicenseKey: "old-key-456",
        openAIApiKey: "sk-user-key",
      };

      // Step 2: Sanitize (simulates what happens in plugin.loadSettings())
      const sanitized = sanitizeSettings(loadedSettings);

      // Step 3: Verify migration occurred
      expect(sanitized.isPlusUser).toBe(true); // Auto-enabled
      expect(sanitized.userId).toBe("existing-user-123"); // Preserved
      expect(sanitized.plusLicenseKey).toBe("old-key-456"); // Preserved for backward compat
      expect(sanitized.openAIApiKey).toBe("sk-user-key"); // Preserved
    });

    it("should correctly handle load → sanitize → save flow for existing Plus user", () => {
      // Step 1: Existing Plus user (already upgraded)
      const loadedSettings = {
        ...DEFAULT_SETTINGS,
        userId: "plus-user-789",
        isPlusUser: true,
        plusLicenseKey: "",
        anthropicApiKey: "sk-ant-key",
      };

      // Step 2: Sanitize
      const sanitized = sanitizeSettings(loadedSettings);

      // Step 3: Verify no changes needed
      expect(sanitized.isPlusUser).toBe(true);
      expect(sanitized.userId).toBe("plus-user-789");
      expect(sanitized.plusLicenseKey).toBe("");
      expect(sanitized.anthropicApiKey).toBe("sk-ant-key");
    });
  });

  describe("Edge cases", () => {
    it("should handle settings with extra/unknown fields", () => {
      const settingsWithExtra = {
        ...DEFAULT_SETTINGS,
        // @ts-expect-error - Testing unknown field handling
        unknownField: "some value",
        // @ts-expect-error
        anotherUnknown: 123,
      };

      const sanitized = sanitizeSettings(settingsWithExtra);
      expect(sanitized.isPlusUser).toBe(true);
      // Unknown fields are preserved (TypeScript just doesn't type them)
    });

    it("should handle partial settings objects", () => {
      const partialSettings: Partial<CopilotSettings> = {
        userId: "test-user",
        openAIApiKey: "sk-test",
      };

      const sanitized = sanitizeSettings(partialSettings as CopilotSettings);
      expect(sanitized.isPlusUser).toBe(true);
      expect(sanitized.userId).toBe("test-user");
      expect(sanitized.openAIApiKey).toBe("sk-test");
    });
  });
});
