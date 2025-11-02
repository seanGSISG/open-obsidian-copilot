<h1 align="center">Copilot for Obsidian</h1>

<h2 align="center">
The Ultimate AI Assistant for Your Second Brain
</h2>

<p align="center">
  <img src="https://img.shields.io/github/v/release/seanGSISG/open-obsidian-copilot?style=for-the-badge&sort=semver" alt="GitHub release (latest SemVer)">
  <img src="https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22copilot%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=for-the-badge" alt="Obsidian Downloads">
</p>

<p align="center">
  <a href="https://www.obsidiancopilot.com/en/docs">Documentation</a> |
  <a href="https://www.youtube.com/@loganhallucinates">Youtube</a> |
  <a href="https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=bug_report.md">Report Bug</a> |
  <a href="https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=feature_request.md">Request Feature</a>
</p>

<p align="center">
  <a href="https://example.com](https://obsidian.md/blog/2024-goty-winners/">
    <img src="./images/reward-banner.svg" alt="Reward Banner" width="400"/>
  </a>
</p>

---

## 🌟 Community Fork Notice

**This is a community fork of [Obsidian Copilot](https://github.com/logancyang/obsidian-copilot)**, maintained under the AGPL-3.0 license with full compliance to open-source principles.

**Credits:** This project builds upon the excellent work by the [original Obsidian Copilot team](https://github.com/logancyang/obsidian-copilot) and its contributors. We are deeply grateful for their vision and contributions to the Obsidian community.

### What's Different in This Fork?

**Phase 1 Complete ✅ - Plus Features Enabled by Default**

All premium features that previously required a Copilot Plus license are now **available to everyone** in this fork:

- **Agent Mode** - Autonomous tool calling with no manual commands needed
- **Projects** - AI-ready context based on folders and tags
- **Advanced Models** - Access to all LLM providers without restrictions
- **Time-Based Queries** - Precision insights from specific time windows
- **Image Understanding** - Analyze images embedded in your notes
- **Multi-Source Analysis** - Combine insights from PDFs, videos, web, and vault

**Coming in Phase 2:** MCP (Model Context Protocol) server integration to replace the Brevilabs API, enabling fully local and extensible tool calling. See [MCP_SETUP.md](./MCP_SETUP.md) for the setup guide (available when Phase 2 is complete).

### Why This Fork?

This fork embraces the original vision of data ownership and no vendor lock-in. By removing licensing restrictions, we ensure that:

- Your AI assistant works entirely on your terms
- No subscription or license key required
- Full transparency with AGPL-3.0 compliance
- Community-driven development and improvements

---

## The What

*Copilot for Obsidian* is your in‑vault AI assistant with chat-based vault search, web and YouTube support, powerful context processing, and ever-expanding agentic capabilities within Obsidian's highly customizable workspace - all while keeping your data under **your** control.

## The Why
Today's AI giants want **you trapped**: your data on their servers, prompts locked to their models, and switching costs that keep you paying. When they change pricing, shut down features, or terminate your account, you lose everything you built.

We are building the opposite. Our goal is to create a portable agentic experience with no provider lock-in. **Data is always yours.** Use whatever LLM you like. Imagine that a brand new model drops, you run it on your own hardware, and it already knows about you (*long-term memory*), knows how to run *the same commands and tools* you have defined over time (as just markdown files), and becomes the thought partner and assistant that you *own*. This is AI that grows with you, not a subscription you're hostage to.

This is the future we believe in. If you share this vision, please support this project!

## Key Features

- **🔒 Your data is 100% yours**: Local search and storage, and full control of your data if you use self-hosted models.
- **🧠 Bring Your Own Model**: Tap any OpenAI-compatible or local model to uncover insights, spark connections, and create content. 
- **🖼️ Multimedia understanding**: Drop in webpages, YouTube videos, images, PDFs, EPUBS, or real-time web search for quick insights.
- **🔍 Smart Vault Search**: Search your vault with chat, no setup required. Embeddings are optional. Copilot delivers results right away.
- **✍️ Composer and Quick Commands**: Interact with your writing with chat, apply changes with 1 click.
- **🗂️ Project Mode**: Create AI-ready context based on folders and tags. Think NotebookLM but inside your vault!
- **🤖 Agent Mode**: Unlock an autonomous agent with built-in tool calling. No commands needed. Copilot automatically triggers vault, web searches or any other relevant tool when relevant.

<p align="center">
  <em>Copilot's Agent can call the proper tools on its own upon your request.</em>
</p>
<p align="center">
  <img src="./images/product-ui-screenshot.png" alt="Product UI screenshot" width="800"/>
</p>

## Table of Contents

- [Get Started](#get-started)
  - [Install Obsidian Copilot](#install-obsidian-copilot)
  - [Set API Keys](#set-api-keys)
- [Usage](#usage)
  - [Free User](#free-user)
  - [Copilot Plus/Believer](#copilot-plusbeliever)
- [Need Help?](#need-help)
- [FAQ](#️faq)

## Copilot V3 is a New Era 🔥

After months of hard work, we have revamped the codebase and adopted a new paradigm for our agentic infrastructure. It opens the door for easier addition of agentic tools (MCP support coming). We will provide a new version of the documentation soon. Here is a couple of new things that you cannot miss!

- **No Setup Required**: You can do vault search out-of-the-box **without building an index first** (Indexing is still available but optional behind the "Semantic Search" toggle in QA settings).
- **Enhanced Accessibility**: Image support and chat context menu are available to all users!
- **Agent Mode**: **Autonomous agent** is available with vault search, web search, youtube, composer and soon a lot other tools! **Long-term memory** is also a tool the agent can use by itself!
- **All Users, All Features**: In this community fork, all premium features including Agent Mode, Projects, and advanced models are available to everyone without a license.

Read the [Changelog](https://github.com/seanGSISG/open-obsidian-copilot/releases/tag/3.0.0).

## Why People Love It ❤️

- *"Copilot is the missing link that turns Obsidian into a true second brain. I use it to draft investment memos with text, code, and visuals—all in one place. It’s the first tool that truly unifies how I search, process, organize, and retrieve knowledge without ever leaving Obsidian. With AI-powered search, organization, and reasoning built into my notes, it unlocks insights I’d otherwise miss. My workflow is faster, deeper, and more connected than ever—I can’t imagine working without it."* - @jasonzhangb, Investor & Research Analyst
- *"Since discovering Copilot, my writing process has been completely transformed. Conversing with my own articles and thoughts is the most refreshing experience I’ve had in decades.”* - Mat QV, Writer
- *"Copilot has transformed our family—not just as a productivity assistant, but as a therapist. I introduced it to my non‑technical wife, Mania, who was stressed about our daughter’s upcoming exam; within an hour, she gained clarity on her mindset and next steps, finding calm and confidence."* - @screenfluent, A Loving Husband

## Get Started

### Install Obsidian Copilot

**Note:** This is a community fork with all Plus features enabled by default. Installation is the same as the original plugin, but no license key is required for premium features.

1. Open **Obsidian → Settings → Community plugins**.
2. Turn off **Safe mode** (if enabled).
3. Click **Browse**, search for **"Copilot for Obsidian"**.
4. Click **Install**, then **Enable**.

**For manual installation** (to use this fork before it's published to the community plugin store):
1. Download the latest release from this repository
2. Extract the files to your vault's `.obsidian/plugins/copilot/` folder
3. Enable the plugin in Obsidian Settings

### Set API Keys

To use Copilot, you'll need API keys from your preferred AI provider(s):

1. Go to **Obsidian → Settings → Copilot → Basic** and click **Set Keys**.
2. Choose your AI provider(s) (e.g., **OpenRouter, Gemini, OpenAI, Anthropic, Cohere**) and paste your API key(s). **OpenRouter is recommended.**
3. All features, including Agent Mode and Projects, are now available without any additional license.

## Usage

### Table of Contents
- [Chat Mode](#chat-mode-reference-notes-and-discuss-ideas-with-copilot)
- [Vault QA Mode](#vault-qa-mode-chat-with-your-entire-vault)
- [Command Palette](#copilots-command-palette)
- [Relevant Notes](#relevant-notes-notes-suggestions-based-on-semantic-similarity-and-links)
- [Agent Mode](#agent-mode-autonomous-tool-calling) - All users
- [Time-Based Queries](#get-precision-insights-from-a-specific-time-window) - All users
- [Image Understanding](#understand-images-in-your-notes) - All users
- [Multi-Source Analysis](#one-prompt-every-sourceinstant-summaries-from-pdfs-videos-and-web) - All users

### Core Features

#### **Chat Mode: reference notes and discuss ideas with Copilot**

Use `@` to add context and chat with your note.

<p align="center">
    <img src="./images/Add-Context.png" alt="Chat Mode" width="700">
</p>

Ask Copilot:
  > *Summarize [[Q3 Retrospective]] and identify the top 3 action items for Q4 based on the notes in {01-Projects}.*

<p align="center">
    <img src="./images/Chat-Mode.png" alt="Chat Mode" width="700">
</p>

#### **Vault QA Mode: chat with your entire vault**

Ask Copilot:
  > *What are the recurring themes in my research regarding the intersection of AI and SaaS?*


<p align="center">
    <img src="./images/Vault-Mode.png" alt="Vault Mode" width="700">
</p>

#### Copilot's Command Palette
Copilot's Command Palette puts powerful AI capabilities at your fingertips. Access all commands in chat window via `/` or via
right-click menu on selected text.

**Add selection to chat context**

Select text and add it to context. Recommend shortcut: `ctrl/cmd + L`

<p align="center">
    <img src="./images/Add-Selection-to-Context.png" alt="Add Selection to Context" width="700">
</p>

**Quick Command**

Select text and apply action without opening chat. Recommend shortcut: `ctrl/cmd + K`


<p align="center">
    <img src="./images/Quick-Command.png" alt="Quick Command" width="700">
</p>


**Edit and Apply with One Click**

Select text and edit with one RIGHT click.

<p align="center">
    <img src="./images/One-Click-Commands.png" alt="One-Click Commands" width="700">
</p>

**Create your Command**

Create commands and workflows in `Settings → Copilot → Command → Add Cmd`.

<p align="center">
    <img src="./images/Create-Command.png" alt="Create Command" width="700">
</p>

**Command Palette in Chat**

Type `/` to use Command Palette in chat window.

<p align="center">
    <img src="./images/Prompt-Palette.png" alt="Prompt Palette" width="700">
</p>

#### **Relevant Notes: notes suggestions based on semantic similarity and links**

Appears automatically when there's useful related content and links.

Use it to quickly reference past research, ideas, or decisions—no need to search or switch tabs.

<p align="center">
    <img src="./images/Relevant-Notes.png" alt="Relevant Notes" width="700">
</p>

### Advanced Features

**All features below are available to all users in this community fork.**

#### **Get Precision Insights From a Specific Time Window**

In agent mode, ask copilot:

  > *What did I do last week?*

<p align="center">
    <img src="./images/Time-Based-Queries.png" alt="Time-Based Queries" width="700">
</p>

#### **Agent Mode: Autonomous Tool Calling**

Copilot's agent automatically calls the right tools—no manual commands needed. Just ask, and it searches the web, queries your vault, and combines insights seamlessly.

Ask Copilot in agent mode:

  > *Research web and my vault and draft a note on AI SaaS onboarding best practices.*

<p align="center">
    <img src="./images/Agent-Mode.png" alt="Agent Mode" width="700">
</p>

#### **Understand Images in Your Notes**

Copilot can analyze images embedded in your notes—from wireframes and diagrams to screenshots and photos. Get detailed feedback, suggestions, and insights based on visual content.

Ask Copilot to analyze your wireframes:

  > *Analyze the wireframe in [[UX Design - Mobile App Wireframes]] and suggest improvements for the navigation flow.*

<p align="center">
    <img src="./images/Note-Image.png" alt="Image Understanding" width="700">
</p>

#### **One Prompt, Every Source—Instant Summaries from PDFs, Videos, and Web**


In agent mode, ask Copilot

  > *Compare the information about [Agent Memory] from this youtube video: [URL], this PDF [file], and @web[search results]. Start with your
     conclusion in bullet points in your response*



<p align="center">
    <img src="./images/One-Prompt-Every-Source.png" alt="One Prompt, Every Source" width="700">
</p>

## **Need Help?**

- Check the [documentation](https://www.obsidiancopilot.com/en/docs) for setup guides, how-tos, and advanced features.
- Watch [Youtube](https://www.youtube.com/@loganhallucinates) for walkthroughs.
- If you're experiencing a bug or have a feature idea, please follow the steps below to help us help you faster:
  - 🐛 Bug Report Checklist
    - ☑️Use the [bug report template](https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=bug_report.md) when reporting an issue
    - ☑️Enable Debug Mode in Copilot Settings → Advanced for more detailed logs
    - ☑️Open the dev console to collect error messages:
      - Mac: Cmd + Option + I
      - Windows: Ctrl + Shift + I
    - ☑️Turn off all other plugins, keeping only Copilot enabled
    - ☑️Attach relevant console logs to your report
    - ☑️Submit your bug report [here](https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=bug_report.md)
  - 💡 Feature Request Checklist
    - ☑️Use the [feature request template](https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=feature_request.md) for requesting a new feature
    - ☑️Clearly describe the feature, why it matters, and how it would help
    - ☑️Submit your feature request [here](https://github.com/seanGSISG/open-obsidian-copilot/issues/new?template=feature_request.md)

## **FAQ**

<details>
  <summary><strong>Why isn’t Vault search finding my notes?</strong></summary>

If you're using the Vault QA mode (or the tool <code>@vault</code> in Agent mode), try the following:

- Ensure you have a working embedding model from your AI model's provider (e.g. OpenAI). Watch this video: [AI Model Setup (API Key)](https://www.youtube.com/watch?v=mzMbiamzOqM)
- Ensure your Copilot indexing is up-to-date. Watch this video: [Vault Mode](https://www.youtube.com/watch?v=hBLMWE8WRFU)
- If issues persist, run <strong>Force Re-Index</strong> or use <strong>List Indexed Files</strong> from the Command Palette to inspect what's included in the index.
- ⚠️ <strong>Don’t switch embedding models after indexing</strong>—it can break the results.
</details>

<details>
  <summary><strong>Why is my AI model returning error code 429: ‘Insufficient Quota’?</strong></summary>

Most likely this is happening because you haven’t configured billing with your chosen model provider—or you’ve hit your monthly quota. For example, OpenAI typically caps individual accounts at $120/month. To resolve:

- ▶️ Watch the “AI Model Setup” video: [AI Model Setup (API Key)](https://www.youtube.com/watch?v=mzMbiamzOqM)
- 🔍 Verify your billing settings in your OpenAI dashboard
- 💳 Add a payment method if one isn’t already on file
- 📊 Check your usage dashboard for any quota or limit warnings

If you’re using a different provider, please refer to their documentation and billing policies for the equivalent steps.

</details>

<details>
  <summary><strong>Why am I getting a token limit error?</strong></summary>

Please refer to your model provider’s documentation for the context window size.

⚠️ If you set a large <strong>max token limit</strong> in your Copilot settings, you may encounter this error.

- <strong>Max tokens</strong> refers to <em>completion tokens</em>, not input tokens.
- A higher output token limit means less room for input!

🧠 Behind-the-scenes prompts for Copilot commands also consume tokens, so:

- Keep your message length short
- Set a reasonable max token value to avoid hitting the cap

💡 For QA with unlimited context, switch to the <strong>Vault QA</strong> mode in the dropdown (Copilot v2.1.0+ required).

</details>

## **🙏 Thank You**

If you share the vision of building the most powerful AI agent for our second brain, consider [sponsoring this project](https://github.com/sponsors/logancyang) or buying me a coffee. Help spread the word by sharing Copilot for Obsidian on Twitter/X, Reddit, or your favorite platform!

<p align="center">
  <img src="https://camo.githubusercontent.com/7b8f7343bfc6e3c65c7901846637b603fd812f1a5f768d8b0572558bde859eb9/68747470733a2f2f63646e2e6275796d6561636f666665652e636f6d2f627574746f6e732f76322f64656661756c742d79656c6c6f772e706e67" alt="BuyMeACoffee" width="200">
</p>

**Acknowledgments**

Special thanks to our top sponsors: @mikelaaron, @pedramamini, @Arlorean, @dashinja, @azagore, @MTGMAD, @gpythomas, @emaynard, @scmarinelli, @borthwick, @adamhill, @gluecode, @rusi, @timgrote, @JiaruiYu-Consilium, @ddocta, @AMOz1, @chchwy, @pborenstein, @GitTom, @kazukgw, @mjluser1, @joesfer, @rwaal, @turnoutnow-harpreet, @dreznicek, @xrise-informatik, @jeremygentles, @ZhengRui, @bfoujols, @jsmith0475, @pagiaddlemon, @sebbyyyywebbyyy, @royschwartz2, @vikram11, @amiable-dev, @khalidhalim, @DrJsPBs, @chishaku, @Andrea18500, @shayonpal, @rhm2k, @snorcup, @JohnBub, @obstinatelark, @jonashaefele, @vishnu2kmohan

## **Community Fork Information**

This community fork is maintained under the AGPL-3.0 license, ensuring full transparency and open-source compliance.

### Key Differences from Original

- **No License Required:** All premium features (Agent Mode, Projects, advanced models) are available to everyone
- **No Backend Dependencies:** Phase 1 removed all Brevilabs API dependencies for Plus features
- **Local-First:** Your data stays under your control with no external service requirements
- **Open Development:** Community-driven improvements and feature additions
- **Phase 2 Coming:** MCP server integration for extensible, fully local tool calling

### Original Project Acknowledgment

This fork builds upon [Obsidian Copilot](https://github.com/logancyang/obsidian-copilot) by the Brevilabs Team. The original project established the foundation for AI-powered knowledge work in Obsidian, and we're grateful for their contributions to the community.

**Original Authors:** Brevilabs Team | Email: logan@brevilabs.com | X/Twitter: [@logancyang](https://twitter.com/logancyang)

### License

This project is licensed under AGPL-3.0, maintaining compliance with open-source principles while building upon the original codebase.
