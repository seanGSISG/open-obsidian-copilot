# Project Context

## Purpose

**Open Obsidian Copilot** is a community fork of Obsidian Copilot that removes proprietary license restrictions and replaces backend-dependent features with open MCP (Model Context Protocol) server integrations.

**Primary Goals:**
1. Remove all paywalled features and license restrictions (AGPL-3.0 compliant)
2. Replace Brevilabs proprietary API with MCP server architecture
3. Provide users full control over their AI tool integrations
4. Maintain feature parity with upstream "Plus" features
5. Create extensible, community-driven AI assistant for Obsidian

**Original Project:** [Obsidian Copilot](https://github.com/logancyang/obsidian-copilot) by Brevilabs Team

## Tech Stack

### Core Technologies
- **TypeScript** - Primary language for plugin development
- **React** - UI components and state management
- **Obsidian Plugin API** - Core integration with Obsidian
- **LangChain** - AI orchestration and chain management
- **Jotai** - Atomic state management for settings

### UI Framework
- **Radix UI** - Accessible UI primitives
- **Tailwind CSS** - Utility-first styling with CVA (Class Variance Authority)
- **Lexical** - Rich text editor for chat input

### AI/LLM Integration
- **OpenAI SDK** - GPT model integration
- **Anthropic SDK** - Claude model integration
- **Google Generative AI** - Gemini integration
- **Cohere** - Embeddings and reranking
- **Ollama/LM Studio** - Local model support
- **MCP Servers** - Tool integration via Model Context Protocol

### Build Tools
- **esbuild** - Fast bundling and minification
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Vector Search
- **LanceDB** - Vector database for semantic search
- **Custom chunking** - Efficient document segmentation

## Project Conventions

### Code Style

**TypeScript:**
- Strict mode enabled (no implicit any, strict null checks)
- Use absolute imports with `@/` prefix: `import { ChainType } from "@/chainFactory"`
- Prefer interfaces for object shapes, types for unions/aliases
- Always add JSDoc comments for functions and methods

**Naming:**
- PascalCase for components and classes
- camelCase for utilities, functions, and variables
- SCREAMING_SNAKE_CASE for constants
- Descriptive, self-documenting names

**React Components:**
- Functional components only (no class components)
- Props interfaces defined above components
- Custom hooks for reusable logic
- Avoid inline styles, use Tailwind classes

**Logging:**
- NEVER use console.log
- Use `logInfo()`, `logWarn()`, `logError()` from `@/logger`

**CSS:**
- NEVER edit `styles.css` directly (it's generated)
- Edit `src/styles/tailwind.css` for custom styles
- Use Tailwind utility classes from `tailwind.config.js`
- Run `npm run build` after CSS changes

### Architecture Patterns

**Core Architecture:**
```
Repository → Manager → UIState → React Components
```

**Key Patterns:**
1. **Single Source of Truth**: MessageRepository stores each message once with computed views
2. **Clean Architecture**: Separation of concerns across layers
3. **Context Reprocessing**: Automatic context updates when messages edited
4. **Computed Views**: Display messages for UI, LLM messages for processing
5. **Project Isolation**: Separate MessageRepository per project
6. **Tool Integration**: MCP-based extensible tool system

**Chain Runner Pattern:**
- BaseChainRunner: Abstract base for chain execution
- CopilotPlusChainRunner: Autonomous tool calling with MCP adapters
- ProjectChainRunner: Project-specific context handling
- AutonomousAgentChainRunner: Full agent capabilities

**State Management:**
- Jotai atoms for global settings
- React context for feature-specific state
- ChatUIState for chat interface state
- Settings versioning and migrations

### Testing Strategy

**Unit Tests:**
- Jest with TypeScript support
- Test files adjacent to implementation (`.test.ts`)
- Mock Obsidian API for plugin testing
- Run: `npm run test`

**Integration Tests:**
- Require API keys in `.env.test`
- Test actual LLM provider integrations
- Run: `npm run test:integration`

**Component Tests:**
- Use `@testing-library/react`
- Test user interactions and state changes

**Pre-PR Checklist:**
- Run `npm run format && npm run lint`
- Ensure all tests pass
- Verify no TypeScript errors

### Git Workflow

**Branching Strategy:**
- `master` - Main development branch
- Feature branches: `feature/description`
- Bugfix branches: `fix/description`
- Release branches: `release/x.y.z`

**Commit Conventions:**
- Use descriptive commit messages
- Reference issues when applicable
- Keep commits atomic and focused
- Sign commits if possible

**Upstream Sync:**
- `origin` - Your fork (https://github.com/seanGSISG/open-obsidian-copilot.git)
- `upstream` - Original repo (https://github.com/logancyang/obsidian-copilot.git)
- Periodically sync: `git pull upstream master`

## Domain Context

### Obsidian Plugin Ecosystem
- **Global `app` variable**: Automatically available in all files (Obsidian API)
- **Vault**: User's collection of markdown notes
- **Workspace**: Obsidian's UI layout and views
- **MetadataCache**: Index of note metadata and links
- **FileManager**: File operations API

### AI Assistant Concepts
- **Chain**: Sequence of AI operations (prompt → LLM → response)
- **Memory**: Conversation history management
- **Tools**: External capabilities (search, file ops, web access)
- **Embeddings**: Vector representations for semantic search
- **Context**: Additional information provided to LLM (notes, URLs, etc.)

### MCP (Model Context Protocol)
- **MCP Servers**: External services providing tools/capabilities
- **Tool Adapters**: Translate between plugin API and MCP servers
- **Tool Mapping**: Configure which MCP server handles each tool type

### Obsidian-Specific Features
- **Wiki-links**: `[[Note Title]]` format for internal links
- **Dataview**: Query language for notes
- **Frontmatter**: YAML metadata in notes
- **Canvas**: Visual workspace for connecting ideas

## Important Constraints

### Technical Constraints
1. **No Backend Server**: Pure client-side plugin (except MCP integrations)
2. **Obsidian API Compatibility**: Must work with current Obsidian versions
3. **Performance**: Index rebuilding can be slow for large vaults
4. **Memory Management**: Careful with large context windows
5. **Sandboxed Environment**: Limited file system access via Obsidian API

### AGPL-3.0 License Constraints
1. **Source Availability**: Must provide source code to users
2. **Network Use**: Modified versions must offer source code
3. **Same License**: All modifications must be AGPL-3.0
4. **Attribution**: Must credit original authors

### Design Principles (from CLAUDE.md)
1. **Generalizable Solutions**: No hardcoded edge cases
2. **Configuration Over Convention**: Make behavior configurable
3. **Universal Patterns**: Work with any folder structure
4. **Never Modify AI Prompts**: Unless explicitly requested

### Breaking Changes to Avoid
- Don't change settings schema without migration
- Don't break existing chat history format
- Don't modify vector store format without reindexing path
- Don't remove tools without deprecation path

## External Dependencies

### Brevilabs API (Being Replaced)
**Current Endpoints:**
- `https://api.brevilabs.com/v1/license` - License validation (REMOVING)
- `https://api.brevilabs.com/v1/broca` - Intent analysis (→ MCP)
- `https://api.brevilabs.com/v1/websearch` - Web search (→ MCP)
- `https://api.brevilabs.com/v1/youtube4llm` - YouTube transcripts (→ MCP)
- `https://api.brevilabs.com/v1/url4llm` - Web scraping (→ MCP)
- `https://api.brevilabs.com/v1/pdf4llm` - PDF extraction (→ MCP)
- `https://api.brevilabs.com/v1/docs4llm` - Document processing (→ MCP)
- `https://api.brevilabs.com/v1/rerank` - Result reranking (→ MCP)

### MCP Server Replacements (Planned)
**Web Search:**
- Brave Search MCP
- Tavily MCP
- SerpAPI MCP

**YouTube:**
- yt-transcript MCP
- youtube-search MCP

**Document Processing:**
- pdf-parser MCP
- docling MCP
- pandoc MCP

**Web Scraping:**
- playwright MCP
- puppeteer MCP
- readability MCP

### LLM Provider APIs
- OpenAI API (GPT models)
- Anthropic API (Claude models)
- Google AI API (Gemini models)
- Cohere API (embeddings, reranking)
- Custom/local endpoints (Ollama, LM Studio)

### Obsidian Platform
- Obsidian Desktop App (v1.4.0+)
- Community Plugins API
- File system access via Obsidian Vault API

## Special Notes

### Development Commands
- **NEVER run `npm run dev`** - User handles builds manually
- `npm run build` - Production build
- `npm run lint:fix` - Auto-fix linting
- `npm run format` - Format with Prettier

### Key Files & Directories
- `src/main.ts` - Plugin entry point
- `src/chainFactory.ts` - Chain type definitions
- `src/LLMProviders/` - LLM provider implementations
- `src/components/` - React UI components
- `src/settings/` - Settings management
- `src/mcp/` - MCP integration (NEW)
- `openspec/` - OpenSpec proposals and specs

### Migration from Upstream
- Settings schema versioned (handle migrations)
- Chat history format must remain compatible
- Vector store may need reindexing on embedding model change
- Memory system integration with chain runners