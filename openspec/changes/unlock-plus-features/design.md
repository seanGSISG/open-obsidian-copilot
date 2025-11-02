# Technical Design: Unlock Plus Features & MCP Integration

## Context

### Background
Obsidian Copilot is an AI-powered assistant plugin for Obsidian that provides chat, semantic search, and various AI commands. The upstream version includes "Plus" tier features that require a Brevilabs license key and depend on proprietary backend API at `https://api.brevilabs.com/v1`.

### Constraints
1. **AGPL-3.0 License**: All modifications must comply with AGPL-3.0 terms
2. **Obsidian Plugin API**: Must work within Obsidian's sandboxed environment
3. **No Backend**: Cannot create our own backend server (client-side only)
4. **Backward Compatibility**: Should preserve user data (settings, chat history, vector store)
5. **TypeScript Strict Mode**: Must maintain type safety

### Stakeholders
- **End Users**: Want access to Plus features without subscription
- **Privacy-Conscious Users**: Want control over external API calls
- **Power Users**: Want to customize and extend tool integrations
- **Original Authors**: Must be properly credited per AGPL-3.0

## Goals / Non-Goals

### Goals
1. Remove all license key validation and paywalls
2. Replace Brevilabs API with MCP server architecture
3. Maintain feature parity with upstream Plus features
4. Provide clear documentation for MCP server setup
5. Create extensible architecture for future tool additions

### Non-Goals
1. **Not** creating our own proprietary backend API
2. **Not** maintaining compatibility with upstream (intentional fork)
3. **Not** removing attribution to original authors
4. **Not** modifying core Obsidian plugin functionality (chat, embeddings, search)
5. **Not** supporting automatic MCP server installation (users configure manually)

## Decisions

### Decision 0: Phased Implementation Strategy

**What**: Implement changes in three sequential phases rather than all at once.

**Phases**:
1. **Phase 1**: Remove license restrictions and enable Plus features
2. **Phase 2**: Implement MCP integration architecture and adapters
3. **Phase 3**: Build MCP configuration UI and documentation

**Why**:
- Lower risk - each phase can be tested independently
- Faster initial value - Phase 1 immediately unlocks Plus features
- Easier debugging - isolate issues to specific phase
- Clear progress tracking - each phase has distinct deliverables

**Alternatives Considered**:
1. **Combined implementation**: All changes at once
   - Rejected: Higher complexity, harder to isolate bugs
   - Rejected: Longer time to first value
2. **Hybrid (Phase 1+2 together)**: Remove licenses and add MCP backend simultaneously
   - Rejected: Still complex, loses benefit of early Plus access

**Trade-offs**:
- ✅ Lower risk per phase
- ✅ Faster time to initial value (Phase 1)
- ✅ Easier testing and validation
- ❌ Longer total timeline
- ❌ Temporary state where Plus features are enabled but non-functional (between Phase 1 and 2)

### Decision 1: MCP as Tool Integration Standard

**What**: Use Model Context Protocol (MCP) servers instead of Brevilabs API for all tool integrations.

**Why**:
- MCP is an emerging industry standard for LLM tool integration
- Allows users to choose their own service providers
- No vendor lock-in - users control their infrastructure
- Extensible - easy to add new tools via MCP servers
- Interoperable with other MCP-compatible tools

**Alternatives Considered**:
1. **Build our own backend API**:
   - Rejected: Creates new lock-in and maintenance burden
   - Rejected: Requires infrastructure costs
   - Rejected: Violates "no backend" goal

2. **Direct API integration for each service**:
   - Rejected: Tight coupling to specific providers
   - Rejected: Harder to extend and maintain
   - Rejected: Users need multiple API keys

3. **Remove Plus features entirely**:
   - Rejected: Users lose valuable functionality
   - Rejected: Defeats purpose of fork

**Trade-offs**:
- ✅ Users have full control
- ✅ No external dependencies
- ❌ Initial setup complexity for users
- ❌ Requires MCP server availability

### Decision 2: Stub License Checks Rather Than Delete

**What**: Keep license-related code but stub it to always return success, rather than deleting entirely.

**Why**:
- Minimizes code changes and risk of breaking dependencies
- Easier to merge upstream updates if needed
- Clear comment trail for what changed
- Less likely to introduce bugs

**Implementation**:
```typescript
// src/plusUtils.ts
export async function checkIsPlusUser(): Promise<boolean | undefined> {
  // Community fork: Always return true (license checks removed)
  return true;
}
```

**Alternatives Considered**:
1. **Delete all license code**:
   - Rejected: Higher risk of breaking dependencies
   - Rejected: Harder to track changes
   - Rejected: Makes merging upstream updates difficult

**Trade-offs**:
- ✅ Lower risk of breaking changes
- ✅ Easier to understand what changed
- ❌ Some "dead code" remains

### Decision 3: Adapter Pattern for MCP Integration

**What**: Create adapter layer between chain runners and MCP servers with singleton MCPManager.

**Architecture**:
```
ChainRunner → ToolAdapter → MCPManager (singleton) → MCP Server
```

**Why**:
- Separates concerns (chain logic vs. tool execution)
- Easy to swap MCP implementations
- Maintains same interface for chain runners
- Testable in isolation
- Singleton provides centralized connection management and state

**MCPManager as Singleton**:
- Matches existing plugin patterns (e.g., LLMProviderManager)
- Plugin-scoped lifecycle (initialized on load, cleaned up on unload)
- Single source of truth for MCP server configurations
- Centralized connection pooling and health monitoring
- Easier to test with mock instances

**Interface Example**:
```typescript
// Singleton MCP Manager
class MCPManager {
  private static instance: MCPManager;
  private servers: Map<string, MCPServerConnection>;

  static getInstance(): MCPManager;
  registerServer(config: MCPServerConfig): Promise<void>;
  removeServer(serverId: string): Promise<void>;
  testConnection(serverId: string): Promise<boolean>;
  getAdapter<T>(toolType: MCPToolType): MCPAdapter<T> | null;
  healthCheck(): Promise<Map<string, boolean>>;
}

// Tool Adapter Interface
interface ToolAdapter {
  execute(args: any): Promise<ToolResult>;
  isAvailable(): Promise<boolean>;
  getRequiredConfig(): string[];
}
```

**Alternatives Considered**:
1. **Direct MCP calls in chain runners**:
   - Rejected: Tight coupling
   - Rejected: Harder to test
   - Rejected: Duplicated code across runners

2. **Per-chat MCP instances**:
   - Rejected: Unnecessary complexity, servers are shared resources
   - Rejected: Connection overhead for each chat

3. **Single monolithic MCP client**:
   - Rejected: Violates single responsibility principle
   - Rejected: Harder to extend with new tools

**Trade-offs**:
- ✅ Clean separation of concerns
- ✅ Easy to test and maintain
- ✅ Centralized state management
- ❌ Additional abstraction layer

### Decision 4: Graceful Degradation When MCP Unavailable

**What**: Features fail gracefully with detailed error messages that include settings paths when MCP servers not configured or unavailable.

**Behavior**:
- Check `MCPManager.isToolAvailable(toolName)` before calling
- Show **detailed** error with settings path: "Web search requires an MCP server. Configure in Settings → Copilot → MCP Servers → Web Search"
- Display errors inline in chat (not modals)
- Include link/button to open settings at correct panel
- Allow conversation to continue despite tool failure
- Use warning styling (not blocking error styling)

**Error Message Format**:
```typescript
// When MCP server not configured
"Web search requires an MCP server. Configure in Settings → Copilot → MCP Servers → Web Search"

// When MCP server is down/unavailable
"Web search MCP server is unavailable. Check server status in Settings → Copilot → MCP Servers"

// General template
"[Feature] requires [requirement]. Configure in Settings → Copilot → MCP Servers → [Tool Type]"
```

**Why**:
- Better user experience than silent failures or vague errors
- Provides actionable guidance with exact navigation path
- Reduces support burden (users can self-service)
- Matches Obsidian user expectations for helpful error messages
- Conversation can continue even if one tool fails

**Alternatives Considered**:
1. **Simple errors**: "Feature requires MCP server configuration"
   - Rejected: Too vague, users don't know what to do next
   - Rejected: Doesn't guide to solution

2. **Interactive setup**: Show inline setup button that opens modal
   - Rejected: Too complex for Phase 1
   - Note: Could add as enhancement in future

3. **Fail hard with exceptions**:
   - Rejected: Poor user experience
   - Rejected: Could crash plugin

4. **Hide tools if MCP unavailable**:
   - Rejected: Confusing (tools disappear/reappear)
   - Rejected: Harder to discover what's available
   - Rejected: Prevents feature discovery

**Trade-offs**:
- ✅ Clear, actionable error messaging
- ✅ Guides users to exact solution
- ✅ Conversation continues despite tool failure
- ❌ Features non-functional until configured

### Decision 5: Settings Migration - Auto-Migrate with Logging

**What**: Automatically set `isPlusUser: true` on first load for existing users, log migration, no modal interruption.

**Migration Logic**:
```typescript
// In settings migration (src/settings/model.ts or migration file)
function migrateSettings(existingSettings: CopilotSettings): CopilotSettings {
  if (existingSettings.isPlusUser === false || existingSettings.isPlusUser === undefined) {
    existingSettings.isPlusUser = true;
    console.log('[Copilot Fork] Auto-enabled Plus features (license restrictions removed)');
  }

  // License key field deprecated but not removed for backward compatibility
  if (existingSettings.licenseKey) {
    console.log('[Copilot Fork] License key is no longer used and will be ignored');
  }

  return existingSettings;
}
```

**Why**:
- Minimal friction for users upgrading to fork
- Settings migration is standard plugin pattern in Obsidian
- Console logging provides transparency for debugging
- Avoids modal fatigue (users don't need to click through upgrade flow)
- Immediate access to Plus features

**Alternatives Considered**:
1. **One-time modal explaining changes**:
   - Rejected: Adds friction and interrupts workflow
   - Rejected: Users may dismiss without reading
   - Rejected: Modal fatigue is real problem

2. **Silent upgrade with no logging**:
   - Rejected: Less transparent for debugging
   - Rejected: Users don't know what changed
   - Rejected: Harder to troubleshoot issues

3. **Require manual toggle in settings**:
   - Rejected: Defeats purpose of removing restrictions
   - Rejected: Users might not know to enable it
   - Rejected: Extra step adds friction

**Trade-offs**:
- ✅ Zero friction upgrade experience
- ✅ Immediate Plus access
- ✅ Transparent via console logs
- ❌ Users may not notice change without reading docs
- ❌ No explicit acknowledgment of fork differences

### Decision 6: Testing Strategy - Mock MCP Responses

**What**: Mock MCP server responses in unit tests, document real server setup for optional integration tests.

**Test Structure**:
```typescript
// Unit test with mocked MCP responses (fast, no external dependencies)
describe('WebSearchAdapter', () => {
  let mockMCPManager: jest.Mocked<MCPManager>;

  beforeEach(() => {
    mockMCPManager = {
      getAdapter: jest.fn().mockReturnValue({
        search: jest.fn().mockResolvedValue({
          results: [
            { title: 'Test Result', url: 'https://example.com', snippet: '...' }
          ]
        })
      })
    } as any;
  });

  it('should return search results from MCP', async () => {
    const adapter = new WebSearchAdapter(mockMCPManager);
    const results = await adapter.search('test query');
    expect(results.results).toHaveLength(1);
    expect(results.results[0].title).toBe('Test Result');
  });

  it('should throw helpful error when MCP not configured', async () => {
    mockMCPManager.getAdapter.mockReturnValue(null);
    const adapter = new WebSearchAdapter(mockMCPManager);
    await expect(adapter.search('test')).rejects.toThrow(
      /Configure in Settings.*MCP Servers.*Web Search/
    );
  });
});

// Integration test with real MCP server (skipped by default, run manually)
describe('WebSearchAdapter Integration', () => {
  it.skip('should fetch real search results from configured MCP server', async () => {
    // Requires: MCP server configured in test environment
    // Run with: npm test -- --testNamePattern="Integration"
    const manager = MCPManager.getInstance();
    const adapter = manager.getAdapter('web-search');
    const results = await adapter.search('TypeScript latest features');
    expect(results.results.length).toBeGreaterThan(0);
  });
});
```

**Why**:
- Unit tests should not depend on external services (fast, reliable)
- Integration tests validate real MCP integration (optional, requires setup)
- Mocks ensure consistent test results and fast CI/CD
- Real server testing validates actual user experience when run manually
- Separation allows running unit tests without MCP server setup

**Alternatives Considered**:
1. **Require test MCP servers for all tests**:
   - Rejected: Makes CI/CD complex and slow
   - Rejected: External dependency makes tests flaky
   - Rejected: Setup barrier for contributors

2. **Skip all MCP testing**:
   - Rejected: Leaves integration completely untested
   - Rejected: Risky - no validation of adapter logic

3. **Stub Brevilabs API for testing**:
   - Rejected: Maintains dependency we're removing
   - Rejected: Doesn't test actual MCP integration

**Trade-offs**:
- ✅ Fast, reliable unit tests
- ✅ Optional integration testing for validation
- ✅ No external dependencies for CI/CD
- ✅ Easy for contributors to run tests
- ❌ Integration tests require manual setup and execution

### Decision 7: Adapter Priority - Web Search and Intent/Rerank First

**What**: Implement web search and intent analysis adapters first in Phase 2, then other tools.

**Implementation Order**:
1. **Phase 2.1** (Critical - Agent Mode foundation):
   - `webSearchAdapter.ts` - Most commonly used Plus feature
   - `intentAdapter.ts` - Required for Agent Mode tool routing
   - `rerankAdapter.ts` - Enhances search result quality

2. **Phase 2.2** (Content extraction tools):
   - `youtubeAdapter.ts` - YouTube transcript extraction
   - `urlAdapter.ts` - Web page content extraction
   - `pdfAdapter.ts` - PDF document processing

3. **Phase 2.3** (Optional/Advanced):
   - `docsAdapter.ts` - Advanced document formats (DOCX, EPUB)

**Why** (based on brainstorming with user):
- **Web Search**: Most commonly used Plus feature, essential for research workflows
- **Intent Analysis**: Required for Agent Mode to determine which tools to call
- **Rerank**: Optimizes search results, improves quality of agent responses
- **Sequential rollout**: Proves architecture with critical features before implementing rest
- **Early validation**: Can test MCP integration with high-value features first

**Alternatives Considered**:
1. **All adapters simultaneously**:
   - Rejected: Higher complexity, harder to validate each adapter
   - Rejected: Longer time to first working feature
   - Rejected: More difficult to debug issues

2. **Content tools first (YouTube/PDF/URL before search)**:
   - Rejected: Less impactful without search working
   - Rejected: Intent analysis needed for Agent Mode to work at all

3. **Random order based on implementation ease**:
   - Rejected: Doesn't prioritize user value
   - Rejected: May leave critical features until last

**Trade-offs**:
- ✅ Fastest path to working Agent Mode
- ✅ High user value features delivered first
- ✅ Easier to validate architecture incrementally
- ✅ Can release Phase 2.1 before 2.2/2.3 if needed
- ❌ Some features remain stubbed longer
- ❌ Content extraction tools wait for Phase 2.2

### Decision 8: Per-Tool MCP Server Mapping

**What**: Users can configure which MCP server handles each tool type.

**Example Configuration**:
```typescript
{
  toolMappings: [
    { toolName: "webSearch", preferredServerId: "brave-search-mcp" },
    { toolName: "youtube", preferredServerId: "yt-transcript-mcp" },
    { toolName: "pdf", preferredServerId: "pdf-parser-mcp" }
  ]
}
```

**Why**:
- Users can choose best provider for each tool
- Allows fallbacks if primary server down
- Flexibility for different use cases

**Alternatives Considered**:
1. **Single MCP server for all tools**:
   - Rejected: Not all MCP servers support all tools
   - Rejected: Limits user choice

2. **Hardcoded MCP server per tool**:
   - Rejected: No user choice
   - Rejected: Defeats purpose of open architecture

**Trade-offs**:
- ✅ Maximum flexibility
- ✅ Supports fallbacks
- ❌ More complex configuration

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Chain Runners                        │
│  (CopilotPlusChainRunner, AutonomousAgentChainRunner)  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │   Tool Adapters     │
         │  (webSearch, etc.)  │
         └──────────┬──────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │    MCP Manager       │
         │  - Server registry   │
         │  - Connection pool   │
         │  - Health checks     │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │    MCP Servers       │
         │  (User-configured)   │
         │  - Brave Search      │
         │  - yt-transcript     │
         │  - pdf-parser        │
         │  - etc.              │
         └──────────────────────┘
```

### Data Flow

**Example: Web Search via MCP**

1. User types message mentioning `@web` or agent detects web search needed
2. `IntentAnalyzer` determines `webSearch` tool required
3. `CopilotPlusChainRunner.executeToolCalls()` invoked
4. Calls `WebSearchAdapter.execute({ query: "..." })`
5. Adapter checks `MCPManager.isToolAvailable("webSearch")`
6. `MCPManager` looks up configured server for `webSearch` tool
7. Makes request to configured MCP server
8. MCP server returns search results
9. Adapter transforms results to expected format
10. Results returned to chain runner
11. LLM receives formatted search results in context

### Key Classes

**MCPManager**
```typescript
class MCPManager {
  private servers: Map<string, MCPServerConfig>;
  private toolMappings: Map<string, string>;

  async callTool(toolName: string, args: any): Promise<any>;
  async testConnection(serverId: string): Promise<boolean>;
  isToolAvailable(toolName: string): boolean;
  registerServer(config: MCPServerConfig): void;
  removeServer(serverId: string): void;
}
```

**ToolAdapter (base interface)**
```typescript
interface ToolAdapter {
  execute(args: any): Promise<ToolResult>;
  isAvailable(): Promise<boolean>;
  getRequiredConfig(): string[];
}
```

**WebSearchAdapter (example)**
```typescript
class WebSearchAdapter implements ToolAdapter {
  async execute(args: { query: string }): Promise<WebSearchResponse> {
    const mcpManager = MCPManager.getInstance();
    if (!mcpManager.isToolAvailable("webSearch")) {
      throw new Error("Web search MCP server not configured");
    }
    const response = await mcpManager.callTool("webSearch", args);
    return this.transformResponse(response);
  }
}
```

### Settings Schema

```typescript
interface MCPServerConfig {
  id: string;                  // Unique ID (user-friendly kebab-case)
  name: string;                // Display name
  type: MCPServerType;         // Tool type this server provides
  enabled: boolean;            // Enable/disable without deleting
  serverUrl: string;           // MCP server endpoint
  apiKey?: string;             // Optional API key for server
  customHeaders?: Record<string, string>;  // Optional headers
  timeout?: number;            // Request timeout (ms)
}

type MCPServerType =
  | 'web-search'
  | 'youtube'
  | 'pdf'
  | 'url'
  | 'docs'
  | 'intent'
  | 'rerank';

interface MCPToolMapping {
  toolName: string;            // e.g., "webSearch"
  preferredServerId: string;   // Primary server ID
  fallbackServerIds?: string[]; // Fallback servers
}

interface MCPSettings {
  servers: MCPServerConfig[];
  toolMappings: MCPToolMapping[];
  enableFallback: boolean;     // Try fallbacks if primary fails
  defaultTimeout: number;      // Default request timeout
}
```

## Risks / Trade-offs

### Risk 1: MCP Standard Adoption
**Risk**: MCP is emerging standard, may change or not gain adoption.
**Likelihood**: Medium
**Impact**: High
**Mitigation**:
- Adapter pattern makes it easy to swap implementations
- Document adapter interface for community extensions
- Monitor MCP spec changes and update accordingly

### Risk 2: User Configuration Complexity
**Risk**: Users may struggle with MCP server setup.
**Likelihood**: High
**Impact**: Medium
**Mitigation**:
- Comprehensive documentation (MCP_SETUP.md)
- In-app help and recommended servers
- Connection testing in UI
- Example configurations provided
- Community support channel

### Risk 3: MCP Server Availability
**Risk**: Recommended MCP servers may not exist or be maintained.
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**:
- Document multiple options per tool type
- Community can create and share MCP servers
- Provide fallback to direct API integration if needed
- Clear error messages guide users to alternatives

### Risk 4: Performance Overhead
**Risk**: MCP adapter layer may add latency.
**Likelihood**: Low
**Impact**: Low
**Mitigation**:
- Adapters are thin wrappers (minimal overhead)
- Connection pooling in MCPManager
- Async operations throughout
- Monitor and optimize if issues arise

### Risk 5: Breaking Upstream Compatibility
**Risk**: Cannot easily merge upstream updates.
**Likelihood**: High (intentional)
**Impact**: Medium
**Mitigation**:
- This is a fork, not a temporary branch
- Monitor upstream for bug fixes and security updates
- Selectively cherry-pick non-conflicting changes
- Maintain own release schedule

## Migration Plan

### For New Users
1. Install plugin from fork repository
2. Configure MCP servers via Settings → MCP Servers
3. All Plus features available immediately

### For Existing Upstream Users
1. **Before Upgrade**:
   - Export chat history (if desired)
   - Note current settings

2. **Upgrade Process**:
   - Uninstall upstream version
   - Install community fork
   - License key field becomes inactive (ignored)
   - Plus features accessible but non-functional until MCP configured

3. **Post-Upgrade**:
   - Configure MCP servers (see MCP_SETUP.md)
   - Test each feature
   - Verify chat history preserved

### Rollback Plan
If users need to rollback:
1. Uninstall community fork
2. Reinstall upstream version
3. Re-enter license key
4. Chat history and settings preserved (except MCP configs)

## Open Questions

1. **Q**: Should we provide default MCP server URLs?
   **A**: No - users must configure explicitly to avoid surprise external calls

2. **Q**: Should we implement caching for MCP responses?
   **A**: Phase 2+ enhancement - not critical for initial release

3. **Q**: Should we support MCP server authentication methods beyond API key?
   **A**: Start with API key, extend later if needed (OAuth, JWT, etc.)

4. **Q**: Should we provide MCP server health monitoring/alerting?
   **A**: Phase 2+ enhancement - start with simple connection test

5. **Q**: Should we maintain backward compatibility with Brevilabs API?
   **A**: No - clean break allows simpler architecture and clearer intent

## Success Metrics

**Technical Metrics**:
- [ ] Zero calls to Brevilabs API in telemetry
- [ ] All Plus features functional with MCP configuration
- [ ] Test coverage >80% for new MCP code
- [ ] No performance regression vs. upstream

**User Experience Metrics**:
- [ ] MCP setup takes <10 minutes with documentation
- [ ] <5 GitHub issues related to MCP configuration in first month
- [ ] Positive community feedback on fork

**Code Quality Metrics**:
- [ ] No TypeScript errors in strict mode
- [ ] All linting rules pass
- [ ] JSDoc coverage 100% for new code
- [ ] Design patterns consistent with project conventions
