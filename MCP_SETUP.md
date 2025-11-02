# MCP Setup Guide

> **STATUS: Coming Soon - Phase 2 in Development**
>
> This guide will be fully populated when Phase 2 (MCP Integration) is complete. In the meantime, this document provides an overview of what's coming and why.

## Table of Contents

- [What is MCP?](#what-is-mcp)
- [Why We're Using MCP](#why-were-using-mcp)
- [Features Enabled by MCP](#features-enabled-by-mcp)
- [Phase 2 Status](#phase-2-status)
- [What to Expect in the Setup Process](#what-to-expect-in-the-setup-process)
- [Current State and Workarounds](#current-state-and-workarounds)
- [Resources and Learning](#resources-and-learning)
- [Tracking Progress](#tracking-progress)
- [Support](#support)

---

## What is MCP?

**Model Context Protocol (MCP)** is an emerging industry standard for connecting Large Language Models (LLMs) to external tools and data sources. Think of it as a universal adapter that lets AI assistants interact with web search, document parsers, APIs, and other services in a standardized way.

### Key Concepts

- **MCP Server**: A service that provides specific tools (e.g., web search, YouTube transcripts, PDF parsing)
- **MCP Client**: The application (Obsidian Copilot) that connects to MCP servers
- **Tools**: Capabilities exposed by MCP servers that the AI can use (search, extract, analyze, etc.)
- **Protocol**: Standardized communication format between clients and servers

### Benefits

- **No Vendor Lock-in**: Choose your own service providers for each tool
- **Privacy Control**: Run MCP servers locally or choose trusted providers
- **Extensibility**: Easy to add new capabilities via community MCP servers
- **Interoperability**: Works with any MCP-compatible tool ecosystem

---

## Why We're Using MCP

This community fork replaces the upstream Brevilabs API with MCP architecture for several important reasons:

### 1. **User Control and Choice**
- You choose which service providers to use for each feature
- No forced dependency on proprietary backend services
- Switch providers anytime without changing your workflow

### 2. **Privacy and Transparency**
- All external API calls go through MCP servers you configure
- Run MCP servers locally if you prefer complete privacy
- No surprise data sharing with third-party services

### 3. **Cost and Flexibility**
- No subscription fees or license keys required
- Use free MCP servers, paid services, or self-hosted options
- Pay only for what you use with your chosen providers

### 4. **Open Architecture**
- MCP is an open standard, not a proprietary protocol
- Community can create and share new MCP servers
- Future-proof as MCP gains broader adoption

### 5. **Simplified Maintenance**
- No backend infrastructure to maintain for this project
- Leverages existing MCP ecosystem
- Clear separation between plugin and external services

---

## Features Enabled by MCP

Once Phase 2 is complete, the following Plus features will be powered by MCP:

### Core Agent Tools

- **Web Search** (`@web`)
  - Search the web for current information
  - Research topics beyond your vault
  - Get real-time answers to factual questions

- **Intent Analysis**
  - Automatically detects which tools to use based on your query
  - Powers Agent Mode routing
  - Improves context understanding

- **Reranking**
  - Optimizes search result relevance
  - Improves quality of agent responses
  - Better context selection

### Content Extraction Tools

- **YouTube Transcripts**
  - Extract transcripts from YouTube videos
  - Summarize video content
  - Reference video information in notes

- **URL Content Extraction**
  - Fetch and parse web page content
  - Extract main text from articles
  - Reference web content in conversations

- **PDF Processing**
  - Extract text from PDF documents
  - Parse document structure
  - Reference PDF content in chat

### Advanced Document Tools

- **DOCX/EPUB Processing**
  - Parse Word documents
  - Extract ebook content
  - Reference various document formats

---

## Phase 2 Status

**Current Phase**: Phase 2 - MCP Integration Architecture (In Progress)

### Implementation Timeline

Phase 2 is being rolled out in sub-phases:

#### Phase 2.1: Foundation (In Progress)
**Priority**: Critical - Agent Mode Foundation

- [ ] MCP Manager implementation (singleton, connection management)
- [ ] Base adapter interface and patterns
- [ ] Web Search adapter (`webSearchAdapter.ts`)
- [ ] Intent Analysis adapter (`intentAdapter.ts`)
- [ ] Rerank adapter (`rerankAdapter.ts`)
- [ ] Error handling with detailed messaging
- [ ] Connection testing utilities

**Target**: Get Agent Mode working with web search and tool routing

#### Phase 2.2: Content Extraction (Planned)
**Priority**: High - Expand Tool Coverage

- [ ] YouTube adapter (`youtubeAdapter.ts`)
- [ ] URL adapter (`urlAdapter.ts`)
- [ ] PDF adapter (`pdfAdapter.ts`)

**Target**: Enable content extraction from various sources

#### Phase 2.3: Advanced Features (Future)
**Priority**: Medium - Nice to Have

- [ ] DOCX adapter (`docsAdapter.ts`)
- [ ] EPUB adapter
- [ ] Advanced caching strategies
- [ ] Fallback server support
- [ ] Health monitoring

**Target**: Complete tool coverage and enhanced reliability

### Phase 3 Preview

After Phase 2 completes, Phase 3 will add:

- Visual MCP server configuration UI in Settings
- Connection testing interface
- Server health monitoring
- Recommended server suggestions
- One-click example configurations

---

## What to Expect in the Setup Process

This section previews what the full setup guide will contain when Phase 2 is complete.

### Prerequisites (Preview)

- Obsidian Copilot community fork installed
- Access to MCP servers (hosted or self-hosted)
- API keys for chosen service providers (if using paid services)
- Basic understanding of JSON configuration (for manual setup)

### Setup Steps (Preview)

The full guide will walk you through:

1. **Choosing MCP Servers**
   - Recommended servers for each tool type
   - Comparison of hosted vs. self-hosted options
   - Free vs. paid service trade-offs

2. **Server Configuration**
   - Adding MCP server endpoints
   - Configuring authentication (API keys, headers)
   - Setting timeouts and retry policies

3. **Tool Mapping**
   - Mapping tools to preferred servers
   - Configuring fallback servers
   - Testing each tool individually

4. **Verification**
   - Connection testing procedures
   - Troubleshooting common issues
   - Performance optimization tips

### Configuration Format (Preview)

The settings will look something like this:

```json
{
  "mcpServers": [
    {
      "id": "brave-search-mcp",
      "name": "Brave Search",
      "type": "web-search",
      "enabled": true,
      "serverUrl": "https://mcp.example.com/brave-search",
      "apiKey": "your-api-key-here"
    }
  ],
  "toolMappings": [
    {
      "toolName": "webSearch",
      "preferredServerId": "brave-search-mcp"
    }
  ]
}
```

**Note**: Phase 3 will add a visual UI for this configuration, but manual setup will be documented first.

---

## Current State and Workarounds

### What Works Now (Phase 1 Complete)

✅ **License restrictions removed**
- All Plus features are enabled in the UI
- No license key validation
- Settings show Plus features as available

✅ **Core plugin functionality**
- Standard chat works perfectly
- Embeddings and vector search functional
- All non-Plus features work as expected

### What Doesn't Work Yet (Phase 2 In Progress)

❌ **Plus Features (MCP-dependent)**

The following features are **enabled but non-functional** until Phase 2 completes:

- Web search (`@web` command)
- YouTube transcript extraction
- URL content extraction
- PDF document parsing
- Agent Mode tool routing

### Error Messages You'll See

When you try to use Plus features before MCP is configured, you'll see helpful error messages like:

```
Web search requires an MCP server.
Configure in Settings → Copilot → MCP Servers → Web Search
```

These errors are **expected and intentional**. They:
- Inform you that MCP setup is required
- Provide exact navigation paths to settings
- Allow conversation to continue despite tool failures
- Will disappear once Phase 2 is complete and you configure MCP servers

### Current Workarounds

**There are no workarounds at this time.** Plus features require MCP integration from Phase 2.

**Options**:
1. **Wait for Phase 2** - The recommended approach
2. **Use non-Plus features** - Standard chat, embeddings, and search work great
3. **Track progress** - See [Tracking Progress](#tracking-progress) below

---

## Resources and Learning

Want to learn more about MCP while waiting for Phase 2?

### Official MCP Resources

- **MCP Specification**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **MCP GitHub**: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
- **Community Servers**: [MCP Server Registry](https://github.com/modelcontextprotocol/servers)

### Related Documentation

- **Technical Design**: See `openspec/changes/unlock-plus-features/design.md` for full architecture
- **Phase 2 Tasks**: See `openspec/changes/unlock-plus-features/tasks.md` for implementation details
- **Project Overview**: See `openspec/project.md` for project context

### Recommended Reading

1. **What is MCP?** - Start with the official MCP introduction
2. **MCP Servers** - Browse the community server registry
3. **Our Design Doc** - Understand why and how we're implementing MCP
4. **Phase 2 Tasks** - See exactly what's being built

---

## Tracking Progress

### Where to Follow Development

- **GitHub Issues**: Filter by `phase-2` label
- **OpenSpec Tasks**: See `openspec/changes/unlock-plus-features/tasks.md`
- **Commit History**: Watch for "Phase 2" commits
- **Release Notes**: Check for Phase 2 completion announcements

### How to Stay Updated

1. **Star/Watch the Repository** - Get GitHub notifications
2. **Check OpenSpec Tasks** - See real-time task completion
3. **Join Community Channels** - Discuss with other users (links TBD)

### Estimated Timeline

**Phase 2.1** (Foundation): In active development
- Web search, intent analysis, rerank adapters
- Core MCP manager implementation
- Target: Essential Agent Mode functionality

**Phase 2.2** (Content Extraction): Follows 2.1 completion
- YouTube, URL, PDF adapters
- Expands tool coverage

**Phase 2.3** (Advanced): Future enhancement
- Document adapters, caching, monitoring

**Phase 3** (UI): After Phase 2 completes
- Visual configuration interface
- Server management UI
- Enhanced user experience

No specific dates are committed to allow for quality implementation.

---

## Support

### Getting Help

**Before Phase 2 Completes**:
- Plus feature errors are expected and documented above
- Review this document for current state and timeline
- Check OpenSpec tasks for implementation progress

**After Phase 2 Completes**:
- This guide will be updated with full setup instructions
- Troubleshooting section will be added
- Community support channels will be established

### Reporting Issues

**Current State Issues**:
- If you find bugs in non-Plus features, please report them
- If Plus features show unexpected behavior beyond "MCP not configured", report it
- If error messages are unhelpful or confusing, let us know

**Not Issues**:
- Plus features not working (expected until Phase 2)
- Missing MCP configuration UI (Phase 3)
- Lack of recommended MCP servers (will be added when tested)

### Contributing

Interested in helping with Phase 2?

1. **Review the Design**: Read `openspec/changes/unlock-plus-features/design.md`
2. **Check Tasks**: See `openspec/changes/unlock-plus-features/tasks.md`
3. **Follow Conventions**: Read `CLAUDE.md` and `SPEC.md`
4. **Submit PRs**: Reference relevant OpenSpec tasks

---

## Coming Soon

This guide will be fully populated with:

- [ ] Step-by-step MCP server setup instructions
- [ ] Recommended MCP servers for each tool type
- [ ] Configuration examples and templates
- [ ] Troubleshooting guide
- [ ] Performance optimization tips
- [ ] Advanced configuration options
- [ ] Security and privacy best practices
- [ ] FAQ section
- [ ] Video tutorials (if community creates them)

**Watch this space!** This document will be updated when Phase 2 reaches completion.

---

**Last Updated**: 2025-11-02
**Phase 2 Status**: In Progress (Phase 2.1)
**Document Version**: 1.0.0 (Placeholder)

---

For questions, feedback, or to track progress, see the repository's GitHub Issues or OpenSpec task tracking.
