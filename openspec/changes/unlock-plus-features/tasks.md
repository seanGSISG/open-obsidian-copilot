# Implementation Tasks

## 1. Phase 1: Remove License Restrictions

### 1.1 Core License Removal
- [ ] 1.1.1 Modify `src/plusUtils.ts`:
  - [ ] Make `checkIsPlusUser()` always return `true` (lines 40-48)
  - [ ] Make `isBelieverPlan()` always return `true` (lines 51-58)
  - [ ] Update `turnOffPlus()` to prevent disabling Plus status (lines 110-126)
- [ ] 1.1.2 Modify `src/LLMProviders/brevilabsClient.ts`:
  - [ ] Stub `checkLicenseKey()` to not throw exceptions (lines 109-116)
  - [ ] Make `validateLicenseKey()` return `{ isValid: true, plan: "believer" }` (lines 218-263)
- [ ] 1.1.3 Update `src/settings/model.ts`:
  - [ ] Set `isPlusUser: true` in `DEFAULT_SETTINGS`
  - [ ] Document deprecated license key field
- [ ] 1.1.4 Update `src/constants.ts`:
  - [ ] Add comment noting Brevilabs API will be replaced by MCP

### 1.2 UI Updates
- [ ] 1.2.1 Modify `src/settings/v2/components/PlusSettings.tsx`:
  - [ ] Remove or gray out license key input field
  - [ ] Add notice: "This fork removes license requirements"
- [ ] 1.2.2 Disable `src/components/modals/CopilotPlusExpiredModal.tsx`:
  - [ ] Prevent modal from showing
- [ ] 1.2.3 Update `src/components/modals/CopilotPlusWelcomeModal.tsx`:
  - [ ] Update messaging for community fork

### 1.3 Testing Phase 1
- [ ] 1.3.1 Verify Plus features accessible without license key
- [ ] 1.3.2 Verify settings save correctly
- [ ] 1.3.3 Verify no expiration modals appear
- [ ] 1.3.4 Run `npm run test` and fix any failing tests

## 2. Phase 2: MCP Integration Architecture

### 2.1 Core MCP Infrastructure
- [ ] 2.1.1 Create `src/mcp/types.ts`:
  - [ ] Define `MCPServerConfig` interface
  - [ ] Define `MCPToolMapping` interface
  - [ ] Define `MCPSettings` interface
  - [ ] Define tool result types
- [ ] 2.1.2 Create `src/mcp/mcpManager.ts`:
  - [ ] Implement singleton MCPManager class
  - [ ] Add server registration/removal methods
  - [ ] Add connection testing functionality
  - [ ] Add server health check methods
  - [ ] Implement fallback handling

### 2.2 MCP Tool Adapters
- [ ] 2.2.1 Create `src/mcp/adapters/webSearchAdapter.ts`:
  - [ ] Implement adapter for Brave/Tavily/SerpAPI MCP
  - [ ] Match Brevilabs `/websearch` response format
  - [ ] Add error handling and fallbacks
- [ ] 2.2.2 Create `src/mcp/adapters/youtubeAdapter.ts`:
  - [ ] Implement adapter for yt-transcript MCP
  - [ ] Match Brevilabs `/youtube4llm` response format
  - [ ] Handle transcript extraction errors
- [ ] 2.2.3 Create `src/mcp/adapters/pdfAdapter.ts`:
  - [ ] Implement adapter for PDF parser MCP
  - [ ] Match Brevilabs `/pdf4llm` response format
  - [ ] Handle binary content conversion
- [ ] 2.2.4 Create `src/mcp/adapters/urlAdapter.ts`:
  - [ ] Implement adapter for Playwright/Puppeteer MCP
  - [ ] Match Brevilabs `/url4llm` response format
  - [ ] Clean HTML to readable text
- [ ] 2.2.5 Create `src/mcp/adapters/docsAdapter.ts`:
  - [ ] Implement adapter for document processing MCP
  - [ ] Match Brevilabs `/docs4llm` response format
  - [ ] Handle multiple document formats (DOCX, EPUB, etc.)
- [ ] 2.2.6 Create `src/mcp/adapters/intentAdapter.ts`:
  - [ ] Implement local intent analysis or MCP adapter
  - [ ] Match Brevilabs `/broca` response format
  - [ ] Determine which tools to call from user message
- [ ] 2.2.7 Create `src/mcp/adapters/rerankAdapter.ts`:
  - [ ] Implement reranking adapter (Cohere or local)
  - [ ] Match Brevilabs `/rerank` response format
  - [ ] Optimize search result ordering

### 2.3 Chain Runner Integration
- [ ] 2.3.1 Modify `src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts`:
  - [ ] Replace Brevilabs client calls with MCP adapters
  - [ ] Update `executeToolCalls()` to use MCPManager (lines 557-597)
  - [ ] Add fallback handling when MCP unavailable
- [ ] 2.3.2 Modify `src/LLMProviders/intentAnalyzer.ts`:
  - [ ] Replace `/broca` call with MCP intent adapter
  - [ ] Maintain same interface for chain runners
- [ ] 2.3.3 Update tool implementations:
  - [ ] Modify `src/tools/SearchTools.ts` to use MCP web search
  - [ ] Modify `src/tools/YoutubeTools.ts` to use MCP YouTube adapter
  - [ ] Update `src/contextProcessor.ts` for URL/PDF via MCP

### 2.4 Settings Schema Updates
- [ ] 2.4.1 Modify `src/settings/model.ts`:
  - [ ] Add `mcpServers: MCPServerConfig[]` to settings schema
  - [ ] Add `mcpToolMappings: MCPToolMapping[]` to settings
  - [ ] Add default MCP server configurations
  - [ ] Implement settings migration for existing users
- [ ] 2.4.2 Create `src/settings/mcpSettingsStore.ts`:
  - [ ] Create Jotai atoms for MCP settings state
  - [ ] Implement persistence to Obsidian settings
  - [ ] Add validation for server configurations

### 2.5 Testing Phase 2
- [ ] 2.5.1 Test web search via MCP adapter
- [ ] 2.5.2 Test YouTube transcript extraction via MCP
- [ ] 2.5.3 Test PDF processing via MCP
- [ ] 2.5.4 Test URL extraction via MCP
- [ ] 2.5.5 Test intent analysis with MCP adapter
- [ ] 2.5.6 Verify fallback behavior when MCP servers unavailable
- [ ] 2.5.7 Run integration tests with configured MCP servers

## 3. Phase 3: MCP Configuration UI

### 3.1 MCP Settings Component
- [ ] 3.1.1 Create `src/settings/v2/components/MCPSettings.tsx`:
  - [ ] Build server list UI (add/edit/remove servers)
  - [ ] Create server configuration form
  - [ ] Add connection test button with status indicator
  - [ ] Implement tool-to-server mapping interface
  - [ ] Add import/export configuration buttons
  - [ ] Display recommended MCP servers for each tool type
- [ ] 3.1.2 Add help/documentation links:
  - [ ] Link to MCP_SETUP.md from settings
  - [ ] Add tooltips explaining each tool type
  - [ ] Include example configurations

### 3.2 Settings Integration
- [ ] 3.2.1 Modify `src/settings/v2/SettingsMainV2.tsx`:
  - [ ] Add "MCP Servers" tab to settings panel
  - [ ] Import and render MCPSettings component
  - [ ] Ensure proper tab navigation
- [ ] 3.2.2 Update settings styling:
  - [ ] Ensure MCP settings match existing UI style
  - [ ] Test responsiveness and layout

### 3.3 Testing Phase 3
- [ ] 3.3.1 Test adding/editing/removing MCP servers
- [ ] 3.3.2 Test connection testing functionality
- [ ] 3.3.3 Test tool mapping changes
- [ ] 3.3.4 Test import/export of configurations
- [ ] 3.3.5 Verify settings persistence across restarts

## 4. Documentation

### 4.1 User Documentation
- [ ] 4.1.1 Create `MCP_SETUP.md`:
  - [ ] Introduction to MCP servers
  - [ ] List recommended MCP servers for each tool:
    - [ ] Web search: Brave, Tavily, SerpAPI
    - [ ] YouTube: yt-transcript
    - [ ] PDF: pdf-parser, docling
    - [ ] URL: playwright, puppeteer, readability
    - [ ] Intent: local LLM or custom MCP
  - [ ] Step-by-step setup instructions
  - [ ] Example configurations for each tool
  - [ ] Troubleshooting common issues
- [ ] 4.1.2 Update `README.md`:
  - [ ] Add fork notice at top
  - [ ] Credit original Obsidian Copilot project
  - [ ] Explain differences from upstream
  - [ ] Link to MCP_SETUP.md
  - [ ] Update installation instructions
  - [ ] Add AGPL-3.0 compliance notice
- [ ] 4.1.3 Create `CHANGELOG.md`:
  - [ ] Document breaking changes
  - [ ] List new features (MCP integration)
  - [ ] Migration guide for existing users

### 4.2 Developer Documentation
- [ ] 4.2.1 Update `CONTRIBUTING.md`:
  - [ ] Note this is a community fork
  - [ ] Remove references to Brevilabs team
  - [ ] Add information about MCP architecture
- [ ] 4.2.2 Add MCP adapter development guide:
  - [ ] Document adapter interface
  - [ ] Provide template for new adapters
  - [ ] Explain how to add new tool types

## 5. Quality Assurance

### 5.1 Code Quality
- [ ] 5.1.1 Run `npm run lint:fix` and resolve all linting issues
- [ ] 5.1.2 Run `npm run format` to format all code
- [ ] 5.1.3 Add JSDoc comments to all new functions
- [ ] 5.1.4 Ensure TypeScript strict mode compliance

### 5.2 Testing
- [ ] 5.2.1 Run full test suite: `npm run test`
- [ ] 5.2.2 Run integration tests: `npm run test:integration`
- [ ] 5.2.3 Manual testing checklist:
  - [ ] Chat mode works without license
  - [ ] Agent mode triggers tools correctly
  - [ ] Web search returns results via MCP
  - [ ] YouTube transcripts work via MCP
  - [ ] PDF processing works via MCP
  - [ ] URL extraction works via MCP
  - [ ] Settings panel loads without errors
  - [ ] MCP configuration saves correctly
  - [ ] Connection testing validates servers
  - [ ] Graceful degradation when MCP unavailable

### 5.3 Performance
- [ ] 5.3.1 Verify no performance regression in core features
- [ ] 5.3.2 Test with large vaults (1000+ notes)
- [ ] 5.3.3 Monitor memory usage during long sessions

## 6. Deployment

### 6.1 Pre-Release
- [ ] 6.1.1 Create release branch: `release/v4.0.0-community`
- [ ] 6.1.2 Update version in `package.json`
- [ ] 6.1.3 Update `manifest.json` with fork information
- [ ] 6.1.4 Final build: `npm run build`
- [ ] 6.1.5 Test built plugin in Obsidian

### 6.2 Release
- [ ] 6.2.1 Create GitHub release with changelog
- [ ] 6.2.2 Tag release: `v4.0.0-community`
- [ ] 6.2.3 Publish release notes
- [ ] 6.2.4 Update README with release information

### 6.3 Post-Release
- [ ] 6.3.1 Monitor GitHub issues for bug reports
- [ ] 6.3.2 Create follow-up issues for improvements
- [ ] 6.3.3 Document known limitations
- [ ] 6.3.4 Archive this change proposal: `openspec archive unlock-plus-features`

## Progress Tracking

**Phase 1**: 0/14 tasks completed
**Phase 2**: 0/32 tasks completed
**Phase 3**: 0/12 tasks completed
**Documentation**: 0/8 tasks completed
**Quality Assurance**: 0/15 tasks completed
**Deployment**: 0/12 tasks completed

**Total**: 0/93 tasks completed (0%)
