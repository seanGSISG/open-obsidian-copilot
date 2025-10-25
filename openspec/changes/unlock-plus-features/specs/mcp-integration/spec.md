# MCP Integration

## ADDED Requirements

### Requirement: MCP Server Registration
The system SHALL allow users to register and configure MCP (Model Context Protocol) servers for tool integrations.

#### Scenario: Register new MCP server
- **WHEN** user adds MCP server configuration with ID, name, type, and server URL
- **THEN** server is registered in MCPManager
- **AND** server appears in settings list
- **AND** configuration is persisted to Obsidian settings

#### Scenario: Edit existing MCP server
- **WHEN** user modifies MCP server configuration
- **THEN** changes are saved immediately
- **AND** active connections are refreshed

#### Scenario: Remove MCP server
- **WHEN** user removes MCP server
- **THEN** server is unregistered from MCPManager
- **AND** dependent tool mappings are updated to remove references
- **AND** configuration is removed from settings

---

### Requirement: MCP Server Connection Testing
The system SHALL provide connection testing functionality for configured MCP servers.

#### Scenario: Test connection success
- **WHEN** user clicks "Test Connection" button for MCP server
- **THEN** system makes health check request to server URL
- **AND** displays success indicator if server responds
- **AND** shows server capabilities if available

#### Scenario: Test connection failure
- **WHEN** user tests connection to unreachable MCP server
- **THEN** system displays clear error message
- **AND** suggests troubleshooting steps
- **AND** does not remove server configuration

#### Scenario: Test connection timeout
- **WHEN** MCP server does not respond within configured timeout
- **THEN** connection test fails with timeout error
- **AND** user can adjust timeout setting

---

### Requirement: Tool-to-Server Mapping
The system SHALL allow users to map tool types to specific MCP servers.

#### Scenario: Configure tool mapping
- **WHEN** user selects MCP server for a tool type (e.g., "webSearch")
- **THEN** tool mapping is saved in settings
- **AND** tool requests route to configured server

#### Scenario: Configure fallback servers
- **WHEN** user configures fallback MCP servers for a tool
- **THEN** system tries fallbacks if primary server fails
- **AND** fallback order is preserved

#### Scenario: Unmapped tool usage
- **WHEN** user attempts to use tool without configured MCP server
- **THEN** system displays clear error message
- **AND** provides link to MCP settings
- **AND** suggests recommended servers for that tool type

---

### Requirement: MCP Tool Adapters
The system SHALL provide adapters that translate tool calls to MCP server requests.

#### Scenario: Web search via MCP
- **WHEN** agent or user invokes web search tool
- **THEN** WebSearchAdapter routes request to configured MCP server
- **AND** transforms MCP response to expected format
- **AND** returns search results to chain runner

#### Scenario: YouTube transcript via MCP
- **WHEN** user provides YouTube URL in message
- **THEN** YoutubeAdapter requests transcript from configured MCP server
- **AND** transforms transcript to expected format
- **AND** includes transcript in LLM context

#### Scenario: PDF processing via MCP
- **WHEN** user references PDF file in message
- **THEN** PdfAdapter sends PDF content to configured MCP server
- **AND** receives extracted text
- **AND** includes text in LLM context

#### Scenario: URL content extraction via MCP
- **WHEN** user provides URL in message
- **THEN** UrlAdapter requests content from configured MCP server
- **AND** receives clean article text
- **AND** includes content in LLM context

#### Scenario: Document processing via MCP
- **WHEN** user references DOCX/EPUB file in message
- **THEN** DocsAdapter sends file to configured MCP server
- **AND** receives extracted text
- **AND** includes text in LLM context

---

### Requirement: Intent Analysis via MCP
The system SHALL analyze user intent using MCP-based intent analyzer or local LLM.

#### Scenario: Determine required tools
- **WHEN** user sends message to agent
- **THEN** IntentAdapter analyzes message to determine needed tools
- **AND** returns list of tool calls with arguments
- **AND** chain runner executes tools in sequence

#### Scenario: No tools needed
- **WHEN** IntentAdapter determines message needs no tools
- **THEN** returns empty tool list
- **AND** chain runner proceeds with direct LLM response

---

### Requirement: Graceful Degradation
The system SHALL handle MCP server unavailability gracefully without crashing.

#### Scenario: MCP server unreachable
- **WHEN** tool adapter cannot reach configured MCP server
- **THEN** adapter returns clear error message
- **AND** chain runner displays error to user
- **AND** provides guidance to check MCP configuration
- **AND** plugin remains functional

#### Scenario: MCP server not configured
- **WHEN** user attempts to use tool without configured MCP server
- **THEN** system displays setup instructions
- **AND** links to MCP_SETUP.md documentation
- **AND** lists recommended MCP servers for that tool

#### Scenario: Fallback server usage
- **WHEN** primary MCP server fails and fallback is configured
- **THEN** adapter tries fallback server
- **AND** logs fallback usage for user awareness

---

### Requirement: MCP Configuration Persistence
The system SHALL persist MCP server configurations in Obsidian settings.

#### Scenario: Save MCP settings
- **WHEN** user modifies MCP configuration
- **THEN** settings are saved to Obsidian data.json
- **AND** settings persist across Obsidian restarts

#### Scenario: Load MCP settings on startup
- **WHEN** plugin loads
- **THEN** MCP configurations are loaded from settings
- **AND** MCPManager initializes with saved servers
- **AND** tool mappings are restored

---

### Requirement: MCP Configuration Import/Export
The system SHALL support importing and exporting MCP configurations for sharing.

#### Scenario: Export configuration
- **WHEN** user clicks "Export Configuration" button
- **THEN** system generates JSON file with all MCP settings
- **AND** sensitive data (API keys) are optionally excluded
- **AND** user can save file to vault or clipboard

#### Scenario: Import configuration
- **WHEN** user imports MCP configuration JSON file
- **THEN** system validates configuration format
- **AND** merges with existing settings (or replaces based on user choice)
- **AND** displays import summary

#### Scenario: Share configuration template
- **WHEN** documentation provides example configurations
- **THEN** users can copy and import templates
- **AND** only need to add their API keys

---

### Requirement: MCP Adapter Error Handling
The system SHALL handle MCP adapter errors with clear messaging and logging.

#### Scenario: MCP response parsing error
- **WHEN** MCP server returns malformed response
- **THEN** adapter logs detailed error
- **AND** returns user-friendly error message
- **AND** suggests checking server compatibility

#### Scenario: MCP authentication error
- **WHEN** MCP server rejects API key
- **THEN** adapter returns authentication error
- **AND** prompts user to verify API key in settings

#### Scenario: MCP rate limiting
- **WHEN** MCP server returns rate limit error
- **THEN** adapter displays rate limit message
- **AND** suggests retry delay or upgrading server plan

---

## Implementation Notes

**MCP Standard Compliance**: Adapters should follow Model Context Protocol specification when available. Document any deviations or extensions.

**Performance Considerations**: MCP requests may add latency. Use connection pooling and async operations to minimize impact.

**Security**: API keys stored in Obsidian settings are encrypted. Warn users about sharing configuration files containing API keys.

**Extensibility**: Adapter interface allows community to create custom MCP adapters for new tool types without modifying core code.
