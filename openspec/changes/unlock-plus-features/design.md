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

**What**: Create adapter layer between chain runners and MCP servers.

**Architecture**:
```
ChainRunner → ToolAdapter → MCPManager → MCP Server
```

**Why**:
- Separates concerns (chain logic vs. tool execution)
- Easy to swap MCP implementations
- Maintains same interface for chain runners
- Testable in isolation

**Interface Example**:
```typescript
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

2. **Single monolithic MCP client**:
   - Rejected: Violates single responsibility principle
   - Rejected: Harder to extend with new tools

**Trade-offs**:
- ✅ Clean separation of concerns
- ✅ Easy to test and maintain
- ❌ Additional abstraction layer

### Decision 4: Graceful Degradation When MCP Unavailable

**What**: Features fail gracefully with clear error messages when MCP servers not configured or unavailable.

**Behavior**:
- Check `MCPManager.isToolAvailable(toolName)` before calling
- Show clear error: "Web search requires MCP server configuration. See Settings → MCP Servers"
- Don't crash or hang - return error state
- Link to setup documentation

**Why**:
- Better user experience than silent failures
- Guides users to solution
- Prevents plugin crashes

**Alternatives Considered**:
1. **Fail hard with exceptions**:
   - Rejected: Poor user experience
   - Rejected: Could crash plugin

2. **Hide tools if MCP unavailable**:
   - Rejected: Confusing (tools disappear/reappear)
   - Rejected: Harder to discover what's available

**Trade-offs**:
- ✅ Clear error messaging
- ✅ Guides users to setup
- ❌ Features non-functional until configured

### Decision 5: Per-Tool MCP Server Mapping

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
