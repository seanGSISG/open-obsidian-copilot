import { Button } from "@/components/ui/button";
import { SettingItem } from "@/components/ui/setting-item";
import { ObsidianNativeSelect } from "@/components/ui/obsidian-native-select";
import { SystemPromptManagerModal, SystemPrompt } from "@/components/system-prompt-manager-dialog";
import { logFileManager } from "@/logFileManager";
import { flushRecordedPromptPayloadToLog } from "@/LLMProviders/chainRunner/utils/promptPayloadRecorder";
import { updateSetting, useSettingsValue } from "@/settings/model";
import { Settings } from "lucide-react";
import React, { useState, useEffect } from "react";

// Built-in templates
const BUILT_IN_TEMPLATES: SystemPrompt[] = [
  {
    id: "default",
    name: "Default Assistant",
    content: "You are a helpful AI assistant. Answer questions clearly and concisely.",
    isBuiltIn: true,
    exampleUrl: "https://example.com/default-assistant",
  },
  {
    id: "professional",
    name: "Professional Tone",
    content:
      "You are a professional AI assistant. Maintain a formal, business-appropriate tone in all responses. Provide detailed, well-structured answers.",
    isBuiltIn: true,
    exampleUrl: "https://example.com/professional-tone",
  },
  {
    id: "creative",
    name: "Creative Writer",
    content:
      "You are a creative AI assistant with a flair for storytelling and imaginative thinking. Use vivid language and engaging narratives in your responses.",
    isBuiltIn: true,
    exampleUrl: "https://example.com/creative-writer",
  },
  {
    id: "technical",
    name: "Technical Expert",
    content:
      "You are a technical AI assistant specializing in programming and technology. Provide detailed technical explanations with code examples when relevant.",
    isBuiltIn: true,
    exampleUrl: "https://example.com/technical-expert",
  },
];

export const AdvancedSettings: React.FC = () => {
  const settings = useSettingsValue();
  const [prompts, setPrompts] = useState<SystemPrompt[]>(BUILT_IN_TEMPLATES);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("default");

  useEffect(() => {
    const saved = localStorage.getItem("systemPrompts");
    if (saved) {
      try {
        const savedPrompts = JSON.parse(saved);
        setPrompts([...BUILT_IN_TEMPLATES, ...savedPrompts]);
      } catch (e) {
        console.error("Failed to load saved prompts:", e);
      }
    }

    const savedSelected = localStorage.getItem("selectedPromptId");
    if (savedSelected) {
      setSelectedPromptId(savedSelected);
    }
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedPromptId(value);
    localStorage.setItem("selectedPromptId", value);
  };

  const handleOpenModal = () => {
    const modal = new SystemPromptManagerModal(app, prompts, (updatedPrompts) => {
      setPrompts(updatedPrompts);
    });
    modal.open();
  };

  return (
    <div className="tw-space-y-4">
      {/* User System Prompt Section */}
      <section className="tw-space-y-4 tw-rounded-lg tw-border tw-p-4">
        <h3 className="tw-text-lg tw-font-semibold">User System Prompt</h3>

        <SettingItem
          type="custom"
          title="Default System Prompt"
          description="Customize the system prompt for all messages, may result in unexpected behavior!"
        >
          <div className="tw-flex tw-items-center tw-gap-3">
            <ObsidianNativeSelect
              value={selectedPromptId}
              onChange={(e) => handleSelectChange(e.target.value)}
              options={prompts.map((prompt) => ({
                label: `${prompt.name}${prompt.isBuiltIn ? " (Built-in)" : ""}`,
                value: prompt.id,
              }))}
              placeholder="Select a system prompt"
              containerClassName="tw-flex-1"
            />

            <Button variant="default" size="icon" onClick={handleOpenModal} title="Manage prompts">
              <Settings className="tw-size-4" />
            </Button>
          </div>
        </SettingItem>

        <SettingItem
          type="text"
          title="System Prompts Folder Name"
          description="Folder where system prompts are stored."
          value={settings.systemPromptsFolder}
          onChange={(value) => updateSetting("systemPromptsFolder", value)}
          placeholder="copilot/system-prompts"
        />
      </section>

      {/* Others Section */}
      <section className="tw-space-y-4 tw-rounded-lg tw-border tw-p-4">
        <h3 className="tw-text-lg tw-font-semibold">Others</h3>

        <SettingItem
          type="switch"
          title="Enable Encryption"
          description="Enable encryption for the API keys."
          checked={settings.enableEncryption}
          onCheckedChange={(checked) => {
            updateSetting("enableEncryption", checked);
          }}
        />

        <SettingItem
          type="switch"
          title="Debug Mode"
          description="Debug mode will log some debug message to the console."
          checked={settings.debug}
          onCheckedChange={(checked) => {
            updateSetting("debug", checked);
          }}
        />

        <SettingItem
          type="custom"
          title="Create Log File"
          description={`Open the Copilot log file (${logFileManager.getLogPath()}) for easy sharing when reporting issues.`}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await flushRecordedPromptPayloadToLog();
              await logFileManager.flush();
              await logFileManager.openLogFile();
            }}
          >
            Create Log File
          </Button>
        </SettingItem>
      </section>
    </div>
  );
};
