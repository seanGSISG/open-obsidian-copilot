# License Management - REMOVED

## REMOVED Requirements

### Requirement: License Key Validation
**Reason**: Community fork removes proprietary license restrictions to unlock all features per AGPL-3.0 terms.

**Migration**: Users upgrading from upstream will have their license key field ignored. No action required. All Plus features become accessible without license validation.

**Original Behavior**: The system validated Brevilabs license keys via `https://api.brevilabs.com/v1/license` endpoint to determine user tier (free/plus/believer) and enable/disable features accordingly.

**Files Affected**:
- `src/plusUtils.ts` - License validation functions
- `src/LLMProviders/brevilabsClient.ts` - License API client
- `src/settings/model.ts` - License key setting
- `src/components/modals/CopilotPlusExpiredModal.tsx` - Expiration modal
- `src/components/modals/CopilotPlusWelcomeModal.tsx` - Welcome modal

---

### Requirement: Plus User Status Tracking
**Reason**: No longer needed when all users have Plus access by default.

**Migration**: `isPlusUser` setting remains in schema but is hardcoded to `true`. Existing settings will be updated automatically.

**Original Behavior**: The system tracked whether a user had valid Plus license via `isPlusUser` boolean in settings. This controlled UI visibility and feature access.

**Files Affected**:
- `src/settings/model.ts` - isPlusUser setting
- `src/plusUtils.ts` - turnOnPlus/turnOffPlus functions
- All UI components checking Plus status

---

### Requirement: License Expiration Handling
**Reason**: No expiration in community fork - all features permanently enabled.

**Migration**: Expiration modals will never show. No user action needed.

**Original Behavior**: The system displayed expiration warnings and blocked Plus features when license expired. Validated expiration dates via backend API.

**Files Affected**:
- `src/components/modals/CopilotPlusExpiredModal.tsx`
- `src/plusUtils.ts` - Expiration check logic

---

### Requirement: License Tier Detection
**Reason**: No license tiers in community fork - single tier with all features.

**Migration**: All users treated as "believer" tier with maximum feature access.

**Original Behavior**: The system detected license tiers (free/plus/believer) and enabled features accordingly. Higher tiers had additional capabilities.

**Files Affected**:
- `src/plusUtils.ts` - isBelieverPlan() function
- `src/LLMProviders/brevilabsClient.ts` - Tier detection in license response

---

## Notes

**AGPL-3.0 Compliance**: Removing license restrictions is explicitly permitted under AGPL-3.0 Section 3: "No covered work shall be deemed part of an effective technological measure... When you convey a covered work, you waive any legal power to forbid circumvention of technological measures..."

**Attribution**: Original authors (Brevilabs Team, Logan Yang) remain credited in LICENSE, README.md, and relevant source files per AGPL-3.0 requirements.

**Code Retention**: License-related code is stubbed (returns success) rather than deleted entirely to minimize breaking changes and maintain code archaeology trail.
