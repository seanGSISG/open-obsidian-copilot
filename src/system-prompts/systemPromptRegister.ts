import { Plugin, TFile, Vault } from "obsidian";
import { isSystemPromptFile, getSystemPromptsFolder } from "@/system-prompts/systemPromptUtils";
import { isPendingFileWrite, initializeSessionPromptFromDefault } from "@/system-prompts/state";
import { SystemPromptManager } from "@/system-prompts/systemPromptManager";
import { logInfo, logError } from "@/logger";
import debounce from "lodash.debounce";

/**
 * Manages vault event listeners for system prompts
 * Automatically syncs file changes to the cache
 */
export class SystemPromptRegister {
  private plugin: Plugin;
  private vault: Vault;
  private manager: SystemPromptManager;

  constructor(plugin: Plugin, vault: Vault) {
    this.plugin = plugin;
    this.vault = vault;
    this.manager = SystemPromptManager.getInstance(vault);
    this.initializeEventListeners();
  }

  /**
   * Initialize the register by loading all prompts
   */
  async initialize(): Promise<void> {
    await this.manager.initialize();
    // Initialize session prompt from global default
    initializeSessionPromptFromDefault();
  }

  /**
   * Clean up event listeners when plugin unloads
   */
  cleanup(): void {
    this.vault.off("create", this.handleFileCreation);
    this.vault.off("delete", this.handleFileDeletion);
    this.vault.off("rename", this.handleFileRename);
    this.vault.off("modify", this.handleFileModify);
  }

  /**
   * Initialize vault event listeners
   */
  private initializeEventListeners(): void {
    this.vault.on("create", this.handleFileCreation);
    this.vault.on("delete", this.handleFileDeletion);
    this.vault.on("rename", this.handleFileRename);
    this.vault.on("modify", this.handleFileModify);
  }

  /**
   * Handle file modification with debounce
   * Debounce ensures frontmatter is fully written before reloading
   */
  private handleFileModify = debounce(
    async (file: TFile) => {
      if (!isSystemPromptFile(file) || isPendingFileWrite(file.path)) {
        return;
      }
      try {
        logInfo(`System prompt file modified: ${file.path}`);
        await this.manager.reloadPrompts();
      } catch (error) {
        logError(`Error processing system prompt modification: ${file.path}`, error);
      }
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );

  /**
   * Handle file creation
   */
  private handleFileCreation = async (file: TFile) => {
    if (!isSystemPromptFile(file) || isPendingFileWrite(file.path)) {
      return;
    }
    try {
      logInfo(`System prompt file created: ${file.path}`);
      await this.manager.reloadPrompts();
    } catch (error) {
      logError(`Error processing system prompt creation: ${file.path}`, error);
    }
  };

  /**
   * Handle file deletion
   */
  private handleFileDeletion = async (file: TFile) => {
    if (!isSystemPromptFile(file) || isPendingFileWrite(file.path)) {
      return;
    }
    try {
      logInfo(`System prompt file deleted: ${file.path}`);
      await this.manager.reloadPrompts();
    } catch (error) {
      logError(`Error processing system prompt deletion: ${file.path}`, error);
    }
  };

  /**
   * Handle file rename
   */
  private handleFileRename = async (file: TFile, oldPath: string) => {
    if (isPendingFileWrite(file.path)) {
      return;
    }

    const folder = getSystemPromptsFolder();
    const wasInFolder = oldPath.startsWith(folder + "/");
    const isInFolder = isSystemPromptFile(file);

    if (wasInFolder || isInFolder) {
      try {
        logInfo(`System prompt file renamed: ${oldPath} -> ${file.path}`);
        await this.manager.reloadPrompts();
      } catch (error) {
        logError(`Error processing system prompt rename: ${file.path}`, error);
      }
    }
  };
}
