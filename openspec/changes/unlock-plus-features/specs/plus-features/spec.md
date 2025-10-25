# Plus Features

## MODIFIED Requirements

### Requirement: Agent Mode Access
The system SHALL provide autonomous agent capabilities without license validation.

**Previous Behavior**: Agent mode was restricted to Plus/Believer license holders. License key validated before enabling agent features.

**New Behavior**: Agent mode is accessible to all users by default. No license validation performed.

#### Scenario: Access agent mode
- **WHEN** user selects Agent Mode from chat controls
- **THEN** agent mode activates immediately
- **AND** no license check is performed
- **AND** autonomous tool calling is available

#### Scenario: Agent tool execution
- **WHEN** user sends message in agent mode
- **THEN** intent is analyzed to determine needed tools
- **AND** tools execute automatically via MCP adapters
- **AND** results are incorporated in LLM response

#### Scenario: Agent mode without MCP configuration
- **WHEN** user activates agent mode without configured MCP servers
- **THEN** agent can still function for non-tool tasks
- **AND** displays setup message when tools are needed
- **AND** provides link to MCP configuration

---

### Requirement: Web Search Access
The system SHALL provide web search capabilities via MCP servers without license validation.

**Previous Behavior**: Web search required Plus license and used Brevilabs `/websearch` endpoint.

**New Behavior**: Web search routes through user-configured MCP server. No license required.

#### Scenario: Web search with configured MCP
- **WHEN** user mentions `@web` or agent determines web search needed
- **THEN** request routes to configured web search MCP server
- **AND** search results are returned and formatted
- **AND** results included in LLM context

#### Scenario: Web search without configured MCP
- **WHEN** user attempts web search without configured MCP server
- **THEN** clear error message displayed
- **AND** recommends MCP servers (Brave, Tavily, SerpAPI)
- **AND** provides link to MCP setup documentation

---

### Requirement: YouTube Transcript Access
The system SHALL provide YouTube transcript extraction via MCP servers without license validation.

**Previous Behavior**: YouTube transcripts required Plus license and used Brevilabs `/youtube4llm` endpoint.

**New Behavior**: YouTube transcripts obtained through user-configured MCP server. No license required.

#### Scenario: YouTube transcript with configured MCP
- **WHEN** user provides YouTube URL in message
- **THEN** request routes to configured YouTube MCP server
- **AND** transcript is extracted and formatted
- **AND** transcript included in LLM context

#### Scenario: YouTube URL without configured MCP
- **WHEN** user provides YouTube URL without configured MCP server
- **THEN** error message explains MCP configuration needed
- **AND** recommends yt-transcript MCP server
- **AND** provides setup instructions link

---

### Requirement: PDF Processing Access
The system SHALL provide PDF text extraction via MCP servers without license validation.

**Previous Behavior**: PDF processing required Plus license and used Brevilabs `/pdf4llm` endpoint.

**New Behavior**: PDF extraction routes through user-configured MCP server. No license required.

#### Scenario: PDF processing with configured MCP
- **WHEN** user references PDF file in message
- **THEN** PDF content sent to configured MCP server
- **AND** extracted text returned and formatted
- **AND** text included in LLM context

#### Scenario: PDF reference without configured MCP
- **WHEN** user references PDF without configured MCP server
- **THEN** error explains PDF processing MCP needed
- **AND** recommends PDF parser MCP servers
- **AND** links to configuration guide

---

### Requirement: URL Content Extraction Access
The system SHALL provide URL content extraction via MCP servers without license validation.

**Previous Behavior**: URL extraction required Plus license and used Brevilabs `/url4llm` endpoint.

**New Behavior**: URL content obtained through user-configured MCP server. No license required.

#### Scenario: URL extraction with configured MCP
- **WHEN** user provides web URL in message
- **THEN** URL sent to configured MCP server for extraction
- **AND** clean article text returned
- **AND** content included in LLM context

#### Scenario: URL without configured MCP
- **WHEN** user provides URL without configured MCP server
- **THEN** error explains URL extraction MCP needed
- **AND** recommends Playwright/Puppeteer/Readability MCP servers
- **AND** provides setup link

---

### Requirement: Document Processing Access
The system SHALL provide multi-format document processing via MCP servers without license validation.

**Previous Behavior**: Document processing (DOCX, EPUB, etc.) required Plus license and used Brevilabs `/docs4llm` endpoint.

**New Behavior**: Document processing routes through user-configured MCP server. No license required.

#### Scenario: Document processing with configured MCP
- **WHEN** user references DOCX/EPUB/other document in message
- **THEN** document sent to configured MCP server
- **AND** extracted text returned
- **AND** content included in LLM context

#### Scenario: Document without configured MCP
- **WHEN** user references document without configured MCP server
- **THEN** error explains document processing MCP needed
- **AND** recommends docling/pandoc MCP servers
- **AND** links to setup documentation

---

### Requirement: Long-term Memory Access
The system SHALL provide long-term memory capabilities without license validation.

**Previous Behavior**: Long-term memory was Plus-tier feature requiring license.

**New Behavior**: Long-term memory accessible to all users by default.

#### Scenario: Memory usage in agent mode
- **WHEN** agent uses memory tool
- **THEN** memory is stored and retrieved without license check
- **AND** memory persists across sessions
- **AND** memory enhances agent responses

---

### Requirement: Image Understanding Access
The system SHALL provide image analysis capabilities without license validation.

**Previous Behavior**: Image understanding was Plus-tier feature requiring license.

**New Behavior**: Image understanding available to all users with vision-capable models.

#### Scenario: Image analysis
- **WHEN** user includes image in message
- **AND** selected model has vision capability
- **THEN** image is processed without license check
- **AND** image analysis included in response

---

### Requirement: Autocomplete Access
The system SHALL provide AI autocomplete without Brevilabs backend dependency.

**Previous Behavior**: Autocomplete used Brevilabs `/autocomplete` and `/wordcomplete` endpoints, requiring Plus license.

**New Behavior**: Autocomplete uses user's configured LLM directly. No external API or license required.

#### Scenario: Text autocomplete
- **WHEN** user triggers autocomplete in editor
- **THEN** completion generated using user's configured chat model
- **AND** no Brevilabs API call made
- **AND** completion appears inline

---

### Requirement: Result Reranking Access
The system SHALL provide search result reranking via MCP or local algorithm without license validation.

**Previous Behavior**: Reranking used Brevilabs `/rerank` endpoint requiring Plus license.

**New Behavior**: Reranking uses configured MCP server or falls back to local algorithm. No license required.

#### Scenario: Rerank with configured MCP
- **WHEN** search results need reranking
- **AND** rerank MCP server configured
- **THEN** results sent to MCP server for reranking
- **AND** reranked results returned

#### Scenario: Rerank without MCP
- **WHEN** search results need reranking
- **AND** no rerank MCP server configured
- **THEN** local reranking algorithm used as fallback
- **AND** results ordered by local relevance scoring

---

## Migration Notes

**For Existing Plus Users**:
- All Plus features remain accessible
- MCP configuration required for tool-dependent features
- No data loss during upgrade
- License key field becomes inactive (ignored)

**For New Users**:
- All features available immediately
- Configure MCP servers to enable tool integrations
- No payment or license required

**Feature Comparison**:
| Feature | Upstream Plus | Community Fork |
|---------|---------------|----------------|
| Agent Mode | License required | Always available |
| Web Search | Via Brevilabs | Via user's MCP server |
| YouTube | Via Brevilabs | Via user's MCP server |
| PDF/Docs | Via Brevilabs | Via user's MCP server |
| Memory | License required | Always available |
| Images | License required | Always available |
| Autocomplete | Via Brevilabs | Via user's LLM |
| Reranking | Via Brevilabs | Via MCP or local |
