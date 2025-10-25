# Change Proposal: Unlock Plus Features & MCP Integration

## Why

The current plugin requires a proprietary Brevilabs license key to access "Plus" features (Agent Mode, web search, YouTube transcripts, PDF processing, etc.). These features depend on the closed-source Brevilabs API backend. This creates:

1. **User lock-in**: Users cannot use Plus features without ongoing subscription
2. **Backend dependency**: All Plus features make network calls to `https://api.brevilabs.com/v1`
3. **Limited control**: Users cannot customize or extend tool integrations
4. **Single point of failure**: If Brevilabs API is down, all Plus features fail

Under the AGPL-3.0 license, we have the legal right to fork and modify this code. This proposal removes proprietary restrictions and replaces backend dependencies with open MCP (Model Context Protocol) server integrations, giving users full control over their AI tool stack.

## What Changes

### Phase 1: Remove License Restrictions
- Remove all license key validation checks from frontend
- Stub out Brevilabs API client license endpoints
- Enable Plus features by default in settings
- Remove Plus expiration modals and upgrade prompts
- Update UI to remove license-related messaging

### Phase 2: MCP Integration Architecture
- Create MCP Manager for server connection management
- Build tool adapters to translate Brevilabs API calls → MCP server calls:
  - Web Search Adapter (replaces `/websearch`)
  - YouTube Adapter (replaces `/youtube4llm`)
  - PDF Adapter (replaces `/pdf4llm`)
  - URL Adapter (replaces `/url4llm`)
  - Document Adapter (replaces `/docs4llm`)
  - Intent Adapter (replaces `/broca` intent analysis)
  - Rerank Adapter (replaces `/rerank`)
- Update chain runners to use MCP adapters instead of Brevilabs client
- Implement graceful fallbacks when MCP servers unavailable

### Phase 3: MCP Configuration UI
- Add MCP Settings panel to configure server connections
- Per-tool MCP server mapping (which server handles each tool type)
- Connection testing and health checks
- Import/export MCP configurations
- Recommended MCP server documentation

### Breaking Changes
- **BREAKING**: License key setting becomes non-functional (removed)
- **BREAKING**: Brevilabs API integration replaced with MCP architecture
- **BREAKING**: Plus features now require user-configured MCP servers to function

### Migration Path
Existing users who upgrade to this fork will:
1. No longer need license keys
2. Need to configure MCP servers for Plus features (or features won't work)
3. Retain all local data, chat history, and settings (except license key)

## Impact

### Affected Capabilities
- `license-management` - **REMOVED** entirely
- `mcp-integration` - **ADDED** new capability
- `plus-features` - **MODIFIED** to work without license checks
- `tool-integration` - **MODIFIED** to use MCP adapters
- `settings-ui` - **MODIFIED** to add MCP configuration panel

### Affected Code Systems

**Core Files Modified:**
- `src/plusUtils.ts` - Remove license validation logic
- `src/LLMProviders/brevilabsClient.ts` - Stub license endpoints, route to MCP
- `src/LLMProviders/intentAnalyzer.ts` - Use MCP adapter for intent analysis
- `src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts` - Use MCP adapters for tools
- `src/settings/model.ts` - Add MCP settings schema, set `isPlusUser: true` default
- `src/constants.ts` - Remove Brevilabs API constants

**New Files Created:**
- `src/mcp/mcpManager.ts` - MCP server connection manager
- `src/mcp/types.ts` - TypeScript interfaces for MCP
- `src/mcp/adapters/webSearchAdapter.ts` - Web search via MCP
- `src/mcp/adapters/youtubeAdapter.ts` - YouTube transcripts via MCP
- `src/mcp/adapters/pdfAdapter.ts` - PDF processing via MCP
- `src/mcp/adapters/urlAdapter.ts` - URL extraction via MCP
- `src/mcp/adapters/docsAdapter.ts` - Document processing via MCP
- `src/mcp/adapters/intentAdapter.ts` - Intent analysis via MCP
- `src/mcp/adapters/rerankAdapter.ts` - Reranking via MCP
- `src/settings/v2/components/MCPSettings.tsx` - MCP configuration UI
- `src/settings/mcpSettingsStore.ts` - MCP settings state management

**UI Components Modified:**
- `src/settings/v2/SettingsMainV2.tsx` - Add MCP Settings tab
- `src/settings/v2/components/PlusSettings.tsx` - Remove license UI
- `src/components/modals/CopilotPlusExpiredModal.tsx` - Remove or disable

**Documentation:**
- `MCP_SETUP.md` - User guide for MCP server setup
- `README.md` - Fork notice and setup instructions

### User Experience Impact
- **Positive**: All Plus features accessible without payment
- **Positive**: Full control over tool integrations
- **Positive**: Privacy-focused (no external API required)
- **Neutral**: Requires initial MCP server configuration
- **Negative**: Breaking change for users upgrading from upstream

### Compatibility
- **Obsidian API**: No changes, maintains compatibility
- **Upstream**: Cannot merge back to upstream (intentional fork)
- **Settings**: Backward compatible except for license key field
- **Chat History**: Fully compatible
- **Vector Store**: Fully compatible

## Risks & Mitigations

**Risk: Users confused about MCP setup**
- Mitigation: Comprehensive MCP_SETUP.md guide
- Mitigation: In-app help links and recommended servers
- Mitigation: Test connection buttons in settings

**Risk: MCP servers not available for all tools**
- Mitigation: Document recommended servers for each tool type
- Mitigation: Graceful fallback (features disabled if no server configured)
- Mitigation: Clear error messages guiding users to setup

**Risk: Breaking compatibility with upstream**
- Mitigation: This is intentional - we maintain fork independently
- Mitigation: Document as community fork, not drop-in replacement

**Risk: AGPL-3.0 compliance issues**
- Mitigation: Clearly credit original authors
- Mitigation: Maintain AGPL-3.0 license
- Mitigation: Provide source code access

## Success Criteria

- [ ] All license checks removed, Plus features accessible
- [ ] MCP Manager successfully routes tool calls to configured servers
- [ ] Settings UI allows users to configure and test MCP servers
- [ ] Documentation clearly explains MCP server setup
- [ ] No network calls to Brevilabs API (except for backwards compatibility stub)
- [ ] All existing features continue to work (chat, embeddings, local search)
- [ ] Tests pass with updated architecture

## Timeline Estimate

- Phase 1 (License Removal): 2-3 hours
- Phase 2 (MCP Integration): 4-6 hours
- Phase 3 (UI & Documentation): 3-4 hours
- **Total**: 9-13 hours of focused development

## Alternatives Considered

**Alternative 1: Keep license checks, only add MCP as optional backend**
- Rejected: Defeats purpose of removing proprietary lock-in
- Rejected: Maintains dependency on Brevilabs infrastructure

**Alternative 2: Remove Plus features entirely**
- Rejected: Users lose valuable functionality
- Rejected: Defeats purpose of fork (making features accessible)

**Alternative 3: Implement own backend API instead of MCP**
- Rejected: Creates new lock-in and maintenance burden
- Rejected: MCP is emerging standard for LLM tool integration
- Rejected: MCP allows users to choose their own providers

**Selected Approach: Remove license + MCP integration**
- Pros: Users have full control, no lock-in, extensible architecture
- Pros: Leverages MCP standard (interoperable with other tools)
- Cons: Requires users to configure MCP servers
- Cons: Breaking change for upgrading users
