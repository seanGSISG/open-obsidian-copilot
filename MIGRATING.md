# Migration Guide: Upgrading to the Community Fork

Welcome! This guide explains what happens when you upgrade from the original Obsidian Copilot to this community fork.

**TL;DR**: Your data is safe, settings are preserved, and Plus features are now available to everyone. You don't need to do anything except read this guide to understand what's changed.

---

## Table of Contents

- [Overview: What's Changing and Why](#overview-whats-changing-and-why)
- [Who This Affects](#who-this-affects)
- [What Happens Automatically](#what-happens-automatically)
- [What You'll Notice](#what-youll-notice)
- [No Action Required (Really!)](#no-action-required-really)
- [Phase 1 vs Phase 2: Understanding the Rollout](#phase-1-vs-phase-2-understanding-the-rollout)
- [Rollback Instructions](#rollback-instructions)
- [FAQ](#faq)
- [Getting Help](#getting-help)

---

## Overview: What's Changing and Why

This is a **community fork** of Obsidian Copilot that removes licensing restrictions and replaces proprietary backend services with open, user-controlled alternatives.

### What's Different?

**Before (Upstream)**:
- Plus features required a Copilot Plus license
- License key validated against Brevilabs backend API
- Some features depended on proprietary backend services

**After (Community Fork)**:
- **All Plus features available to everyone**
- No license key required
- Backend services being replaced with MCP (Model Context Protocol) servers that you control

### Why Fork?

This fork embraces the original vision of **data ownership and no vendor lock-in**:
- Your AI assistant works entirely on your terms
- No subscription or license key required
- Full transparency with AGPL-3.0 compliance
- Community-driven development and improvements

**We remain deeply grateful** to the original Obsidian Copilot team for their excellent work and contributions to the community.

---

## Who This Affects

### Existing Copilot Users

If you're upgrading from the original plugin:
- ✅ All your settings are preserved
- ✅ All your chat history is preserved
- ✅ Your vault index is preserved
- ✅ Plus features are now unlocked (if you didn't have them before)
- ℹ️ Your license key field will be ignored (but not deleted)

### New Users

If you're installing for the first time:
- ✅ All Plus features are enabled by default
- ✅ No license key required
- ✅ Same installation process as any Obsidian plugin

---

## What Happens Automatically

When you first load the community fork, the plugin automatically:

### 1. Settings Migration
```
✓ Checks your existing settings
✓ Sets isPlusUser = true (unlocking Plus features)
✓ Preserves all other settings unchanged
✓ Logs migration to console for transparency
```

### 2. License Key Handling
- Your license key field (if you had one) remains in settings but is **no longer used**
- The field is preserved for backward compatibility
- No data is deleted - we respect your existing configuration

### 3. Chat History & Index
- All chat history files (`copilot-conversations/*.md`) are preserved
- Your vector store index remains intact
- No re-indexing required

**Result**: You can continue working immediately with all Plus features available.

---

## What You'll Notice

### In the UI

#### 1. Plus Features Always Enabled
You'll see these features available without a license:
- **Agent Mode** - Autonomous tool calling
- **Projects** - AI-ready context based on folders and tags (organize conversations by project scope)
- **Advanced Models** - Access to all LLM providers
- **Time-Based Queries** - "What did I do last week?"
- **Image Understanding** - Analyze images in your notes
- **Multi-Source Analysis** - Combine insights from PDFs, videos, web, and vault

#### 2. Community Fork Notices
You may see references to the "community fork" in:
- Plugin description
- Settings panel
- Documentation links

#### 3. License Key Field (Deprecated)
The license key field in settings is still visible but marked as:
```
[i] License keys are no longer required in this community fork.
    All Plus features are available to everyone.
```

### In the Settings

#### Current (Phase 1)
Your settings look almost identical to before, except:
- Plus features are always enabled
- License key field is inactive

#### Coming Soon (Phase 2)
A new **"MCP Servers"** tab will appear with:
- Configuration for web search, YouTube, PDF extraction, etc.
- Connection testing
- Recommended server options

---

## No Action Required (Really!)

### For Basic Features
If you only use core features (chat, vault search, commands), **nothing changes**:
- Chat with notes: ✅ Works
- Vault QA mode: ✅ Works
- Command palette: ✅ Works
- Custom prompts: ✅ Works

### For Plus Features (Phase 1)
Currently unlocked but some require configuration:
- **Agent Mode**: Toggle is enabled and can be activated, but web-based agent tools (web search, YouTube) won't work until Phase 2 MCP setup is complete
- **Projects**: ✅ Fully functional
- **Image Understanding**: ✅ Fully functional
- **Time-Based Queries**: ✅ Fully functional (uses vault search)

### For Plus Features (Phase 2 - Coming Soon)
These features will require MCP server configuration:
- Web search (`@web`)
- YouTube transcript extraction
- PDF content extraction
- Web page content extraction

**Don't worry**: Clear error messages will guide you to set up MCP servers when needed.

---

## Phase 1 vs Phase 2: Understanding the Rollout

This fork is being released in phases to minimize risk and deliver value quickly.

### Phase 1: Unlock Plus Features (✅ COMPLETE)
**What**: Remove license restrictions, enable Plus UI
**Status**: Available now
**Result**: All Plus features are unlocked and accessible

**What Works**:
- ✅ Agent Mode UI toggle is enabled and can be activated
- ✅ Projects fully functional
- ✅ Image understanding working
- ✅ Time-based queries working
- ✅ All chat and vault features working

**What Needs Configuration** (temporary):
- ⚠️ Agent Mode web-based tools (web search, YouTube) - Require MCP server (coming in Phase 2)
- ⚠️ Web search (`@web`) - Requires MCP server (coming in Phase 2)
- ⚠️ YouTube transcripts - Requires MCP server (coming in Phase 2)
- ⚠️ PDF extraction - Requires MCP server (coming in Phase 2)

### Phase 2: MCP Integration (🚧 IN PROGRESS)
**What**: Replace Brevilabs backend with MCP servers
**Status**: Coming soon
**Result**: Complete independence from proprietary services

**What You'll Get**:
- 🔧 MCP server configuration UI
- 🔧 Web search via your choice of provider (Brave, Tavily, etc.)
- 🔧 YouTube transcript extraction
- 🔧 PDF and document processing
- 🔧 Full local control over all external tools

**How You'll Know It's Ready**:
- New "MCP Servers" tab in settings
- Setup guide (`MCP_SETUP.md`) will be released with Phase 2 completion
- Release notes will announce Phase 2 completion

---

## Rollback Instructions

If you need to return to the original plugin, here's how:

### Step 1: Backup Your Data (Optional but Recommended)
Before rolling back, optionally backup:
```
.obsidian/plugins/copilot/data.json          (settings)
copilot-conversations/                        (chat history)
```

**Note**: If you've configured MCP servers in Phase 2 and plan to return to the fork later, also backup your MCP configuration from `data.json`.

### Step 2: Uninstall Community Fork
1. Open **Obsidian → Settings → Community Plugins**
2. Find **Copilot for Obsidian**
3. Click **Uninstall**

### Step 3: Reinstall Original Plugin
1. In **Community Plugins**, click **Browse**
2. Search for **"Copilot for Obsidian"**
3. Install the **original version** (check plugin author/repository)
4. Enable the plugin

### Step 4: Re-Enter License Key (If You Had One)
1. Go to **Settings → Copilot → Basic**
2. Enter your Copilot Plus license key
3. Validate the key

### What's Preserved
✅ All settings (except MCP configurations)
✅ All chat history
✅ Your vault index
✅ Custom prompts and commands

### What's Lost
❌ MCP server configurations (fork-specific)
❌ Access to Plus features (unless you have a valid license)

---

## FAQ

### General Questions

<details>
<summary><strong>Will I lose any data during migration?</strong></summary>

**No.** All your data is preserved:
- Settings are migrated automatically
- Chat history remains intact
- Vault index is preserved
- Custom prompts and commands unchanged

The migration is non-destructive and logs all changes to the console.
</details>

<details>
<summary><strong>Do I need to do anything to upgrade?</strong></summary>

**No.** The upgrade happens automatically:
1. Install the community fork plugin
2. Enable it in Obsidian
3. Settings migrate automatically
4. Plus features are immediately available

You don't need to click anything or configure anything (except MCP servers in Phase 2 for certain features).
</details>

<details>
<summary><strong>What happens to my license key?</strong></summary>

Your license key remains in settings but is **ignored**:
- The field is preserved for backward compatibility
- No validation occurs
- You can delete it if you want, but it's not necessary
- Rollback to upstream will require re-entering it
</details>

<details>
<summary><strong>Is this legal?</strong></summary>

**Yes, absolutely.** This fork is fully compliant with the AGPL-3.0 license:
- The original project is licensed under AGPL-3.0
- AGPL-3.0 explicitly permits forking and modification
- We credit the original authors
- All changes are released under the same AGPL-3.0 license
- Source code is publicly available

See `SPEC.md` for detailed legal analysis.
</details>

<details>
<summary><strong>Can I still use my existing API keys?</strong></summary>

**Yes!** Your AI provider API keys (OpenAI, Anthropic, Google, etc.) continue to work exactly as before:
- OpenRouter
- Anthropic
- OpenAI
- Google Gemini
- Cohere
- Azure OpenAI
- Local models (Ollama, LM Studio)

Nothing changes about how you connect to LLM providers.
</details>

### Plus Features

<details>
<summary><strong>Why are some Plus features not working yet?</strong></summary>

**Phase 1** (current) unlocked the Plus UI but some features require backend services that are being replaced in **Phase 2**:

**Currently Working**:
- ✅ Projects
- ✅ Image understanding
- ✅ Time-based queries
- ✅ Agent Mode UI

**Requires Phase 2 (MCP)**:
- ⚠️ Web search (`@web`)
- ⚠️ YouTube transcripts
- ⚠️ PDF extraction

You'll see clear error messages guiding you to configure MCP servers when Phase 2 is released.
</details>

<details>
<summary><strong>How do I know when Phase 2 is ready?</strong></summary>

You'll know Phase 2 is complete when:
1. A new **"MCP Servers"** tab appears in Settings → Copilot
2. The `MCP_SETUP.md` guide is available in the repository
3. Release notes announce Phase 2 completion
4. Error messages for web search/YouTube change from "coming soon" to configuration instructions

Follow the repository for updates: [GitHub Releases](#)
</details>

<details>
<summary><strong>What is MCP and why is it needed?</strong></summary>

**MCP (Model Context Protocol)** is an emerging industry standard for connecting LLMs to external tools and services.

**Why we're using it**:
- **Open standard**: Not proprietary to any vendor
- **User control**: You choose which services to use
- **Extensible**: Easy to add new tools
- **No lock-in**: Switch providers anytime

**In Practice**:
Instead of the plugin calling Brevilabs backend for web search, it calls an MCP server that you configure (like Brave Search, Tavily, or others).

You'll configure MCP servers in Phase 2 via Settings → Copilot → MCP Servers.
</details>

### Technical Questions

<details>
<summary><strong>How do I verify the migration succeeded?</strong></summary>

Check these indicators:

**1. Console Logs** (Open Dev Tools: `Cmd/Ctrl + Option/Shift + I`)
```
[Copilot Fork] Auto-enabled Plus features (license restrictions removed)
```

**2. Settings File** (`.obsidian/plugins/copilot/data.json`)
```json
{
  "isPlusUser": true,
  ...
}
```

**3. UI Features**
- Agent Mode toggle is available
- Projects tab is accessible
- No "Upgrade to Plus" prompts

If you see all three, migration succeeded!
</details>

<details>
<summary><strong>Where are my settings stored?</strong></summary>

**Settings File**:
```
.obsidian/plugins/copilot/data.json
```

**Chat History**:
```
copilot-conversations/*.md
```

**Vector Index** (if using semantic search):
```
.obsidian/plugins/copilot/indexes/
```

These locations are unchanged from the original plugin.
</details>

<details>
<summary><strong>Can I run both plugins at the same time?</strong></summary>

**No.** You should only have one version installed:
- Either the original Obsidian Copilot
- Or this community fork

Running both will cause conflicts and unpredictable behavior.

If you want to test the fork, uninstall the original first.
</details>

<details>
<summary><strong>Will future upstream updates be merged?</strong></summary>

**Selectively.** This is an intentional fork, not a temporary branch:
- We'll monitor upstream for bug fixes and security updates
- Non-conflicting changes may be cherry-picked
- We maintain our own release schedule
- Major architectural changes will diverge

The fork's goal is independence, not maintaining upstream compatibility.
</details>

### Troubleshooting

<details>
<summary><strong>I'm getting "Web search requires MCP server" errors</strong></summary>

**Expected behavior in Phase 1**. This feature requires MCP server configuration coming in Phase 2.

**What you can do now**:
- Use vault search instead: Ask questions about your notes
- Use other Plus features that are working: Projects, image understanding
- Wait for Phase 2 release (coming soon)

**When Phase 2 is ready**:
- Configure MCP servers in Settings → Copilot → MCP Servers
- Follow the MCP_SETUP.md guide
- Test connection and start using web search
</details>

<details>
<summary><strong>Agent Mode isn't calling tools automatically</strong></summary>

**Phase 1 Status**: Agent Mode UI is unlocked but some tools need MCP configuration (Phase 2).

**What works now**:
- ✅ Vault search tool
- ✅ Time-based queries
- ✅ Image analysis

**Requires Phase 2**:
- ⚠️ Web search
- ⚠️ YouTube transcripts
- ⚠️ PDF extraction

The agent will work but may not trigger tools that need external services until Phase 2.
</details>

<details>
<summary><strong>My chat history disappeared</strong></summary>

**This should not happen.** Chat history is preserved in migration.

**Check these locations**:
1. **Chat history files**: `copilot-conversations/*.md`
2. **Settings → Copilot → Chat**: Look for conversation list

**If files exist but don't show in UI**:
1. Restart Obsidian
2. Disable and re-enable the plugin
3. Check console for errors (Cmd/Ctrl + Option/Shift + I)

**If files are missing**:
- Check if you have a backup (`.obsidian/plugins/copilot/data.json.backup`)
- Restore from Obsidian's `.obsidian` sync if using Obsidian Sync
- Contact support (see [Getting Help](#getting-help))
</details>

<details>
<summary><strong>I see TypeScript/linting errors in console</strong></summary>

**Likely unrelated to migration.** This fork maintains the same code quality standards.

**Try these steps**:
1. Update Obsidian to the latest version
2. Disable all other plugins temporarily
3. Restart Obsidian
4. Check if errors persist

**If errors mention "Brevilabs" or "license"**:
- This is expected (we're removing those dependencies)
- Errors should be non-blocking
- Report on GitHub if they affect functionality
</details>

---

## Getting Help

### Documentation
- **Project Overview**: See `README.md`
- **Technical Specification**: See `SPEC.md`
- **MCP Setup** (Phase 2): See `MCP_SETUP.md` (coming soon)
- **Original Docs**: [Obsidian Copilot Docs](https://www.obsidiancopilot.com/en/docs)

### Support Channels
- **Bug Reports**: [GitHub Issues](https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=bug_report.md)
- **Feature Requests**: [GitHub Issues](https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=feature_request.md)
- **Discussions**: [GitHub Discussions](https://github.com/seanGSISG/open-obsidian-copilot/discussions)

### Before Reporting Issues
Please provide:
1. **Version**: Community fork version number
2. **Phase**: Phase 1 or Phase 2
3. **Console Logs**: Open Dev Tools (Cmd/Ctrl + Option/Shift + I) and copy errors
4. **Settings**: Your `data.json` with API keys redacted
5. **Steps to Reproduce**: What you did before the issue occurred

### Debugging Checklist
When something doesn't work:
- [ ] Check console for errors (Cmd/Ctrl + Option/Shift + I)
- [ ] Enable **Debug Mode** in Settings → Copilot → Advanced
- [ ] Disable other plugins temporarily
- [ ] Restart Obsidian
- [ ] Verify API keys are valid
- [ ] Check if feature requires MCP (Phase 2)

---

## What's Next?

### Immediate (Phase 1 Complete ✅)
You can now:
- Use all Plus features (Projects, Agent Mode UI, etc.)
- Continue your existing workflows without interruption
- Explore features that were previously locked

### Coming Soon (Phase 2 🚧)
Watch for:
- MCP server configuration UI
- Web search fully functional
- YouTube transcript extraction
- PDF and document processing
- Complete independence from proprietary services

### Long-Term Vision
This fork aims to:
- Maintain all features of the original plugin
- Provide complete user control over data and services
- Foster community-driven development
- Integrate with MCP ecosystem as it grows
- Add new features through open protocols

---

## Final Notes

### You're in Control
This fork puts you in the driver's seat:
- No subscriptions
- No proprietary backends
- No vendor lock-in
- Your data, your terms

### Community Driven
We're building this together:
- Open development on GitHub
- Community contributions welcome
- Transparent decision-making
- AGPL-3.0 ensures it stays open

### Grateful to Original Authors
This fork builds on excellent work by the [original Obsidian Copilot team](https://github.com/logancyang/obsidian-copilot). Their vision for AI-powered knowledge work laid the foundation for this community-driven version.

---

**Welcome to the community fork! Your data is safe, your settings are preserved, and Plus features are now yours. Enjoy! 🎉**

---

*Last Updated*: 2025-11-02
*Fork Version*: Phase 1 Complete
*License*: AGPL-3.0
