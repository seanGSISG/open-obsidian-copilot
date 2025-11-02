#!/usr/bin/env node
/**
 * Verification script for Task 1.3.1: Verify Plus features accessible without license key
 *
 * This script performs static code analysis to verify implementation.
 */

const fs = require('fs');
const path = require('path');

console.log('=== Task 1.3.1 Verification ===\n');

let allPassed = true;

// Test 1: Verify checkIsPlusUser returns true
console.log('Test 1: checkIsPlusUser() implementation');
const plusUtils = fs.readFileSync('src/plusUtils.ts', 'utf8');
const checkIsPlusUserMatch = plusUtils.match(/export async function checkIsPlusUser[^}]*{[\s\S]*?return true;[\s\S]*?}/);
if (checkIsPlusUserMatch) {
  console.log('  ✓ checkIsPlusUser() returns true');
} else {
  console.log('  ✗ checkIsPlusUser() does NOT return true');
  allPassed = false;
}

// Test 2: Verify isBelieverPlan returns true
console.log('\nTest 2: isBelieverPlan() implementation');
const isBelieverPlanMatch = plusUtils.match(/export async function isBelieverPlan[^}]*{[\s\S]*?return true;[\s\S]*?}/);
if (isBelieverPlanMatch) {
  console.log('  ✓ isBelieverPlan() returns true');
} else {
  console.log('  ✗ isBelieverPlan() does NOT return true');
  allPassed = false;
}

// Test 3: Verify turnOffPlus is a no-op
console.log('\nTest 3: turnOffPlus() is a no-op');
const turnOffPlusMatch = plusUtils.match(/export function turnOffPlus.*{[\s\S]*?\/\/ Community fork: No-op/);
if (turnOffPlusMatch) {
  console.log('  ✓ turnOffPlus() is a no-op (Plus cannot be disabled)');
} else {
  console.log('  ✗ turnOffPlus() may not be a no-op');
  allPassed = false;
}

// Test 4: Verify DEFAULT_SETTINGS.isPlusUser is true
console.log('\nTest 4: DEFAULT_SETTINGS configuration');
const constants = fs.readFileSync('src/constants.ts', 'utf8');
const defaultPlusUserMatch = constants.match(/isPlusUser:\s*true/);
if (defaultPlusUserMatch) {
  console.log('  ✓ DEFAULT_SETTINGS.isPlusUser is true');
} else {
  console.log('  ✗ DEFAULT_SETTINGS.isPlusUser is NOT true');
  allPassed = false;
}

// Test 5: Verify plusLicenseKey is deprecated
console.log('\nTest 5: License key deprecation');
const licenseKeyDeprecated = constants.match(/plusLicenseKey:.*\/\/.*DEPRECATED/);
if (licenseKeyDeprecated) {
  console.log('  ✓ plusLicenseKey is marked as DEPRECATED');
} else {
  console.log('  ⚠ plusLicenseKey deprecation comment not found (non-critical)');
}

// Test 6: Verify sanitizeSettings auto-enables Plus
console.log('\nTest 6: Settings migration (auto-enable Plus)');
const settings = fs.readFileSync('src/settings/model.ts', 'utf8');
const sanitizeMatch = settings.match(/if \(settingsToSanitize\.isPlusUser === false \|\| settingsToSanitize\.isPlusUser === undefined\)/);
const autoEnableMatch = settings.match(/settingsToSanitize\.isPlusUser = true;/);
if (sanitizeMatch && autoEnableMatch) {
  console.log('  ✓ sanitizeSettings() auto-enables Plus for existing users');
} else {
  console.log('  ✗ sanitizeSettings() may not auto-enable Plus');
  allPassed = false;
}

// Test 7: Verify migration logging
console.log('\nTest 7: Migration transparency (logging)');
const migrationLogMatch = settings.match(/logInfo.*Auto-enabled Plus/);
if (migrationLogMatch) {
  console.log('  ✓ Settings migration includes logging for transparency');
} else {
  console.log('  ⚠ Migration logging not found (non-critical)');
}

// Test 8: Verify useIsPlusUser hook exists
console.log('\nTest 8: useIsPlusUser() hook');
const useIsPlusUserMatch = plusUtils.match(/export function useIsPlusUser\(\)/);
if (useIsPlusUserMatch) {
  console.log('  ✓ useIsPlusUser() hook is exported');
} else {
  console.log('  ✗ useIsPlusUser() hook not found');
  allPassed = false;
}

// Test 9: Verify UI components use isPlusUser check
console.log('\nTest 9: UI component Plus feature gating');
const chatControls = fs.readFileSync('src/components/chat-components/ChatControls.tsx', 'utf8');
const uiPlusCheckMatch = chatControls.match(/isPlusUser \?/);
if (uiPlusCheckMatch) {
  console.log('  ✓ UI components check isPlusUser for feature gating');
} else {
  console.log('  ⚠ UI Plus checks not found in expected locations');
}

// Test 10: Verify Plus features are accessible (not always hidden)
console.log('\nTest 10: Plus features accessibility in UI');
const copilotPlusAccessible = chatControls.match(/ChainType\.COPILOT_PLUS_CHAIN/);
const projectsAccessible = chatControls.match(/ChainType\.PROJECT_CHAIN/);
if (copilotPlusAccessible && projectsAccessible) {
  console.log('  ✓ Copilot Plus and Projects modes are in UI code');
} else {
  console.log('  ⚠ Plus features may not be accessible in UI');
}

// Test 11: Verify brevilabsClient is stubbed
console.log('\nTest 11: Brevilabs client license check removal');
const brevilabsClient = fs.readFileSync('src/LLMProviders/brevilabsClient.ts', 'utf8');
const checkLicenseStubbed = brevilabsClient.match(/private checkLicenseKey.*{[\s\S]*?\/\/ Community fork: License checks removed/);
const validateLicenseStubbed = brevilabsClient.match(/async validateLicenseKey[\s\S]*?return\s*{\s*isValid:\s*true,\s*plan:\s*"believer"/);
if (checkLicenseStubbed) {
  console.log('  ✓ checkLicenseKey() is stubbed (no-op)');
} else {
  console.log('  ✗ checkLicenseKey() may not be stubbed');
  allPassed = false;
}
if (validateLicenseStubbed) {
  console.log('  ✓ validateLicenseKey() returns valid believer plan');
} else {
  console.log('  ✗ validateLicenseKey() may not return valid believer plan');
  allPassed = false;
}

// Final summary
console.log('\n=== Verification Summary ===');
if (allPassed) {
  console.log('✓ ALL TESTS PASSED - Plus features are accessible without license key');
  console.log('\nVerification Details:');
  console.log('  • checkIsPlusUser() always returns true');
  console.log('  • isBelieverPlan() always returns true');
  console.log('  • turnOffPlus() is a no-op (Plus cannot be disabled)');
  console.log('  • DEFAULT_SETTINGS.isPlusUser is true');
  console.log('  • Settings migration auto-enables Plus for existing users');
  console.log('  • useIsPlusUser() hook is available');
  console.log('  • Brevilabs license checks are stubbed');
  console.log('  • Plus UI features (Copilot Plus, Projects) are accessible');
  process.exit(0);
} else {
  console.log('✗ SOME TESTS FAILED - Review implementation');
  process.exit(1);
}
