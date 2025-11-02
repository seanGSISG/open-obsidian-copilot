# Changelog

All notable changes to Copilot for Obsidian will be documented in this file.


The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0-community-phase1] - 2025-11-02

### Community Fork Announcement

This release marks the first version of the **community-maintained fork** of Copilot for Obsidian. Following the original plugin's transition to a paid model, this fork removes all license restrictions and makes previously Plus-only features available to everyone at no cost.

**Key Philosophy:**
- All features free and open source
- No license checks or restrictions
- Community-driven development
- Transparent roadmap and development process

See [Phase 2 Roadmap](./openspec/changes/unlock-plus-features/design.md#phase-2-mcp-integration-architecture-and-adapters) for upcoming MCP integration features.

### Added

#### Core Features Now Available to All Users
- **Advanced AI Models**: Access to Claude 4.5 Sonnet, GPT-5, and other premium models without restrictions
- **Enhanced Chat Capabilities**: Full conversation history, context management, and multi-turn interactions
- **Semantic Search**: Vector-based search across your entire vault
- **Advanced Commands**: All AI-powered commands including summarization, rewriting, and custom prompts
- **Custom Model Configuration**: Configure custom endpoints and models without limitations

#### User Interface Enhancements
- Community fork notice in settings header
- Community notice in About section with repository link
- Clear messaging about open source nature of the fork
- Improved error messages for MCP features (graceful degradation)

#### Developer Experience
- Comprehensive test suite for Plus utilities
- Test coverage for settings auto-migration
- Integration test structure for future MCP features

### Changed

#### Settings & Configuration
- **Automatic Plus Feature Enablement**: All users automatically have Plus features enabled on upgrade
  - Existing users: Settings automatically migrated with `enablePlus: true`
  - New users: Plus features enabled by default
  - No user action required
- **Simplified Settings UI**: Removed Plus subscription-related UI elements
- **Settings Model**: Updated default values to enable Plus features for new installations

#### License & Restrictions
- **Removed License Validation**: Eliminated all license checking code
- **Removed Feature Gating**: No features are restricted or require payment
- **Removed Subscription Logic**: Eliminated subscription status checks and validation
- **Removed Usage Limits**: No artificial limits on API calls or features

#### Codebase & Architecture
- Updated BrevilabsClient to gracefully handle MCP endpoints (preparation for Phase 2)
- Simplified Plus utilities to remove subscription dependencies
- Cleaned up feature flag logic throughout codebase
- Updated constants to reflect community fork branding

### Removed

- License validation system
- Subscription status checking
- Plus-only feature restrictions
- Usage tracking for license enforcement
- Payment-related UI components
- Subscription renewal prompts

### Fixed

- Users upgrading from previous versions now automatically receive Plus features
- Settings migration properly enables Plus features for existing users
- Consistent feature availability across all installations

### Technical Details

#### Migration Strategy
The release includes automatic settings migration:
```typescript
// Existing users upgrading from v3.x.x
{
  enablePlus: true,  // Automatically set
  // All other settings preserved
}

// New users installing v4.0.0+
{
  enablePlus: true,  // Default value
  // Standard default settings
}
```

#### Breaking Changes
- **License validation removed**: Any code or plugins depending on license checks will need updates
- **Plus feature flags remain**: Internal `enablePlus` flag retained for future use but always true by default
- **Settings structure preserved**: Backward compatible with existing settings files

#### Architecture Changes
- `src/plusUtils.ts`: Simplified to remove subscription logic
- `src/LLMProviders/brevilabsClient.ts`: Updated for future MCP support
- `src/settings/model.ts`: Plus features enabled by default
- `src/constants.ts`: Updated branding and messaging

### Migration Guide

#### For Existing Users
**No action required!** When you upgrade to v4.0.0-community-phase1:
1. Your settings will automatically migrate
2. Plus features will be enabled automatically
3. All your existing settings and chat history are preserved
4. You'll see community fork notices in the UI

#### What You'll Notice
- Community fork notices in settings and about section
- Access to all features without restrictions
- No license or subscription prompts
- Link to community repository for support and contributions

#### For New Users
Simply install the plugin and enjoy all features out of the box - no configuration needed!

### Security & Privacy
- No license servers contacted
- No usage data transmitted for licensing
- Same privacy-first approach as original plugin
- All API calls go directly to your configured providers

### Support & Contributing
- **Issues**: Report bugs via [GitHub Issues](https://github.com/seanGSISG/open-obsidian-copilot/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/seanGSISG/open-obsidian-copilot/discussions)
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
- **Roadmap**: See [openspec/changes/](./openspec/changes/) for planned features

### Looking Ahead: Phase 2 (Planned)
- MCP (Model Context Protocol) integration
- Enhanced tool use capabilities
- Advanced agent workflows
- Improved context management
- See [Phase 2 Design Document](./openspec/changes/unlock-plus-features/design.md#phase-2-mcp-integration-architecture-and-adapters) for details

---

## [3.1.1] - Previous Release

For changelog of previous versions (original plugin), see git history before fork point.

---

## Versioning Strategy

Starting with v4.0.0, this community fork uses semantic versioning:
- **Major version (4.x.x)**: Breaking changes or significant architecture updates
- **Minor version (x.1.x)**: New features, enhancements
- **Patch version (x.x.1)**: Bug fixes, minor improvements

Phase releases use suffixes: `-community-phase1`, `-community-phase2`, etc.

---

## Version Links

[4.0.0-community-phase1]: https://github.com/seanGSISG/open-obsidian-copilot/releases/tag/v4.0.0-community-phase1
[3.1.1]: https://github.com/seanGSISG/open-obsidian-copilot/releases/tag/v3.1.1