# Obsidian Copilot Community Fork - Technical Specification

## Project Overview

This is a community fork of Obsidian Copilot that removes proprietary license restrictions and replaces backend-dependent features with open MCP (Model Context Protocol) server integrations.

### Legal Basis

This fork is **fully compliant** with the original project's AGPL-3.0 license, which explicitly permits:
- Forking and modification of the source code
- Removal of technological restrictions (Section 3)
- Redistribution under the same AGPL-3.0 license

**License Compliance Requirements:**
- All modifications must be released under AGPL-3.0
- Source code must be made available to users
- Must credit original authors (Brevilabs Team)
- Must clearly mark as a modified version

## Project Goals

1. **Remove Proprietary Paywalls**: Eliminate all license key checks and Plus-tier restrictions
2. **Replace Backend Dependencies**: Replace Brevilabs API calls with MCP server integrations
3. **Maintain Feature Parity**: Ensure all "Plus" features remain functional
4. **Community Control**: Give users full control over their AI tool integrations
5. **Open Architecture**: Create extensible MCP-based architecture for future tools

## Architecture Overview

### Current (Proprietary) Architecture
```
User → Frontend → License Check → Brevilabs API (https://api.brevilabs.com/v1)
                       ↓
                   BLOCKED if no valid license
```

### New (Open) Architecture
```
User → Frontend → MCP Manager → User's MCP Servers
                       ↓
                   ALWAYS ALLOWED
```

## Implementation Phases

### Phase 1: Remove License Restrictions

**Goal**: Bypass all frontend license checks to unlock UI features

#### Files Requiring Modification:

**1. `src/plusUtils.ts`** (Primary license check logic)
- Lines 40-48: `checkIsPlusUser()` - Make return `true` without backend call
- Lines 51-58: `isBelieverPlan()` - Make return `true` without backend call
- Lines 110-126: `turnOffPlus()` - Prevent disabling Plus status
- **Strategy**: Stub out backend validation, always return success

**2. `src/LLMProviders/brevilabsClient.ts`** (API client)
- Lines 109-116: `checkLicenseKey()` - Remove exception throwing
- Lines 218-263: `validateLicenseKey()` - Always return `{ isValid: true, plan: "believer" }`
- **Strategy**: Stub all API endpoints to avoid network calls initially

**3. `src/settings/model.ts`** (Settings schema)
- Update `DEFAULT_SETTINGS` to set `isPlusUser: true` by default
- Ensure Plus features are enabled by default

**4. `src/constants.ts`** (Constants)
- Line 8: Document `BREVILABS_API_BASE_URL` will be replaced by MCP servers
- Add new constants for MCP server configurations

#### UI Components Affected:
- `src/settings/v2/components/PlusSettings.tsx` - May need UI updates
- `src/settings/v2/components/CopilotPlusSettings.tsx` - May need UI updates
- `src/components/modals/CopilotPlusExpiredModal.tsx` - Remove or disable
- `src/components/modals/CopilotPlusWelcomeModal.tsx` - Update messaging

### Phase 2: MCP Integration Architecture

**Goal**: Replace Brevilabs backend services with MCP server calls

#### New Files to Create:

**1. `src/mcp/mcpManager.ts`**
- Central service for managing MCP server connections
- Configuration storage and retrieval
- Connection testing and health checks
- Fallback handling when servers unavailable

**2. `src/mcp/types.ts`**
- TypeScript interfaces for MCP configurations
- Tool result types
- Server connection types

**3. `src/mcp/adapters/webSearchAdapter.ts`**
- Replaces `/websearch` endpoint
- Integrates with Brave Search MCP / Tavily MCP / similar
- Returns results in format expected by chain runners

**4. `src/mcp/adapters/youtubeAdapter.ts`**
- Replaces `/youtube4llm` endpoint (line 408 of brevilabsClient.ts)
- Integrates with yt-transcript MCP or similar
- Extracts transcripts from YouTube URLs

**5. `src/mcp/adapters/pdfAdapter.ts`**
- Replaces `/pdf4llm` endpoint (line 308)
- Integrates with PDF extraction MCP servers
- Processes PDF binary content to text

**6. `src/mcp/adapters/docsAdapter.ts`**
- Replaces `/docs4llm` endpoint (line 325)
- Handles DOCX, EPUB, etc.
- Integrates with document processing MCP servers

**7. `src/mcp/adapters/urlAdapter.ts`**
- Replaces `/url4llm` endpoint (line 296)
- Integrates with web scraping MCP (Playwright/Puppeteer)
- Extracts clean content from web pages

**8. `src/mcp/adapters/intentAdapter.ts`**
- Replaces `/broca` endpoint (line 265) for intent analysis
- Uses local LLM or intent-analysis MCP server
- Determines which tools to call based on user message

**9. `src/mcp/adapters/rerankAdapter.ts`**
- Replaces `/rerank` endpoint (line 280)
- Optional: uses local reranking or Cohere/similar
- Improves search result ordering

#### Files Requiring Modification for MCP Integration:

**1. `src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts`**
- Lines 390-406: Replace `IntentAnalyzer.analyzeIntent()` call with MCP adapter
- Lines 414-417: Replace `executeToolCalls()` to use MCP adapters
- **Integration points**: All tool execution logic

**2. `src/LLMProviders/intentAnalyzer.ts`**
- Replace Brevilabs `/broca` call with local intent analysis
- Use MCP adapter for distributed intent analysis if configured

**3. `src/tools/SearchTools.ts`**
- Update web search tools to use MCP adapter
- Fallback to existing implementation if MCP unavailable

**4. `src/tools/YoutubeTools.ts`**
- Update YouTube transcript fetching to use MCP adapter

**5. `src/contextProcessor.ts`**
- Update URL and PDF processing to use MCP adapters
- Handle various document formats through MCP

### Phase 3: MCP Configuration UI

#### New Files to Create:

**1. `src/settings/v2/components/MCPSettings.tsx`**
- Main MCP configuration panel
- Add/edit/remove MCP server connections
- Map tools to specific MCP servers
- Test connection functionality
- Import/export configurations

**2. `src/settings/mcpSettingsStore.ts`**
- Jotai atoms for MCP settings state
- Persistence to Obsidian settings
- Default MCP server configurations

#### Files Requiring Modification:

**1. `src/settings/v2/SettingsMainV2.tsx`**
- Add new "MCP Servers" tab
- Import and render MCPSettings component

**2. `src/settings/model.ts`**
- Add `mcpServers` to settings schema
- Add per-tool MCP server mappings

## Brevilabs API Endpoints to Replace

Reference from `src/LLMProviders/brevilabsClient.ts`:

| Endpoint | Purpose | MCP Replacement | Priority |
|----------|---------|-----------------|----------|
| `/license` | License validation | Remove entirely | HIGH |
| `/broca` | Intent analysis | Local LLM or MCP | HIGH |
| `/websearch` | Web search | Brave/Tavily MCP | HIGH |
| `/youtube4llm` | YouTube transcripts | yt-transcript MCP | HIGH |
| `/url4llm` | Web scraping | Playwright MCP | MEDIUM |
| `/pdf4llm` | PDF extraction | PDF processor MCP | MEDIUM |
| `/docs4llm` | Document processing | Document MCP | MEDIUM |
| `/rerank` | Result reranking | Cohere/local | LOW |
| `/autocomplete` | Text completion | Use existing LLM | LOW |
| `/wordcomplete` | Word completion | Use existing LLM | LOW |

## Recommended MCP Servers

### Web Search
- **Brave Search MCP**: Fast, privacy-focused search
- **Tavily MCP**: AI-optimized search results
- **SerpAPI MCP**: Google/Bing results

### YouTube
- **yt-transcript MCP**: YouTube transcript extraction
- **youtube-search MCP**: YouTube video search

### Document Processing
- **pdf-parser MCP**: PDF text extraction
- **docling MCP**: Multi-format document processing
- **pandoc MCP**: Universal document converter

### Web Scraping
- **playwright MCP**: Full browser automation
- **puppeteer MCP**: Headless Chrome scraping
- **readability MCP**: Clean article extraction

### Intent Analysis
- **Local LLM**: Use user's configured chat model
- **ollama MCP**: Local model inference
- **Custom intent MCP**: Lightweight intent classifier

## Configuration Schema

```typescript
interface MCPServerConfig {
  id: string;
  name: string;
  type: 'web-search' | 'youtube' | 'pdf' | 'url' | 'docs' | 'intent' | 'rerank';
  enabled: boolean;
  serverUrl: string;
  apiKey?: string;
  customHeaders?: Record<string, string>;
  timeout?: number;
}

interface MCPToolMapping {
  toolName: string;
  preferredServerId: string;
  fallbackServerIds?: string[];
}

interface MCPSettings {
  servers: MCPServerConfig[];
  toolMappings: MCPToolMapping[];
  enableFallback: boolean;
  defaultTimeout: number;
}
```

## Testing Checklist

- [ ] All UI elements load without errors
- [ ] Plus features accessible without license key
- [ ] Chat mode works with local models
- [ ] Agent mode triggers tool calls correctly
- [ ] Web search returns results (via MCP)
- [ ] YouTube transcripts work (via MCP)
- [ ] PDF processing works (via MCP)
- [ ] URL extraction works (via MCP)
- [ ] Settings panel saves MCP configurations
- [ ] Connection testing validates MCP servers
- [ ] Fallback handling when MCP unavailable

## Documentation Deliverables

1. **SPEC.md** (this file): Technical specification
2. **MCP_SETUP.md**: User guide for setting up MCP servers
3. **README.md updates**: Fork notice, credits, setup instructions
4. **CHANGELOG.md**: Document all changes from upstream

## Ethical Considerations

This fork is created for legitimate purposes:
- Educational use and learning
- Self-hosting and privacy control
- Community development and contribution
- No intention to harm the original project

**We encourage users to:**
- Support the original Obsidian Copilot project if they find value
- Contribute improvements back to the community
- Use this fork responsibly and ethically
- Respect the AGPL-3.0 license terms

## Attribution

**Original Project**: Obsidian Copilot by Brevilabs Team
- Repository: https://github.com/logancyang/obsidian-copilot
- License: AGPL-3.0
- Authors: Logan Yang (@logancyang) and contributors

**Community Fork Maintainers**: [To be determined]

## Future Enhancements

- MCP server marketplace/directory
- One-click MCP server installation
- Performance monitoring and analytics
- Multi-provider fallback chains
- Custom tool builder UI
- Community-contributed MCP adapters

---

**Last Updated**: 2025-10-25
**AGPL-3.0 License**: All modifications remain under AGPL-3.0
