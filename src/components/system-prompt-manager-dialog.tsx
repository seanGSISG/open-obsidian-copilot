import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Copy, ExternalLink, Lightbulb, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { App, Modal, Platform } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { useSettingsValue } from "@/settings/model";
import { Separator } from "@/components/ui/separator";

// Built-in templates
const BUILT_IN_TEMPLATES = [
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

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  isBuiltIn?: boolean;
  exampleUrl?: string;
}

type FormErrors = {
  name?: string;
  content?: string;
};

interface SystemPromptManagerDialogContentProps {
  prompts: SystemPrompt[];
  onPromptsChange: (prompts: SystemPrompt[]) => void;
  contentEl: HTMLElement;
  onClose: () => void;
}

export function SystemPromptManagerDialogContent({
  prompts,
  onPromptsChange,
  onClose,
  contentEl,
}: SystemPromptManagerDialogContentProps) {
  const settings = useSettingsValue();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptContent, setNewPromptContent] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const saveToLocalStorage = (updatedPrompts: SystemPrompt[]) => {
    const customPrompts = updatedPrompts.filter((p) => !p.isBuiltIn);
    localStorage.setItem("systemPrompts", JSON.stringify(customPrompts));
  };

  const handleCreatePrompt = () => {
    const newErrors: FormErrors = {};

    if (!newPromptName.trim()) {
      newErrors.name = "Name is required";
    } else if (prompts.some((p) => p.name === newPromptName.trim())) {
      newErrors.name = "A prompt with this name already exists";
    }

    if (!newPromptContent.trim()) {
      newErrors.content = 'Prompt is required"';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newPrompt: SystemPrompt = {
      id: `custom-${Date.now()}`,
      name: newPromptName.trim(),
      content: newPromptContent.trim(),
      isBuiltIn: false,
    };

    const updatedPrompts = [...prompts, newPrompt];
    onPromptsChange(updatedPrompts);
    saveToLocalStorage(updatedPrompts);

    setNewPromptName("");
    setNewPromptContent("");
    setErrors({});
  };

  const handleUpdatePrompt = () => {
    if (!editingPrompt) {
      return;
    }

    const newErrors: FormErrors = {};

    if (!newPromptName.trim()) {
      newErrors.name = "Name is required";
    } else if (prompts.some((p) => p.name === newPromptName.trim() && p.id !== editingPrompt.id)) {
      newErrors.name = "A prompt with this name already exists";
    }

    if (!newPromptContent.trim()) {
      newErrors.content = "Content is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedPrompts = prompts.map((p) =>
      p.id === editingPrompt.id
        ? { ...p, name: newPromptName.trim(), content: newPromptContent.trim() }
        : p
    );

    onPromptsChange(updatedPrompts);
    saveToLocalStorage(updatedPrompts);

    setEditingPrompt(null);
    setNewPromptName("");
    setNewPromptContent("");
    setErrors({});
    setIsEditDialogOpen(false);
  };

  const handleDeletePrompt = (id: string) => {
    const promptToDelete = prompts.find((p) => p.id === id);
    if (promptToDelete?.isBuiltIn) {
      return;
    }

    const updatedPrompts = prompts.filter((p) => p.id !== id);
    onPromptsChange(updatedPrompts);
    saveToLocalStorage(updatedPrompts);
  };

  const handleDuplicatePrompt = (prompt: SystemPrompt) => {
    const duplicatedPrompt: SystemPrompt = {
      id: `custom-${Date.now()}`,
      name: `${prompt.name} (Copy)`,
      content: prompt.content,
      isBuiltIn: false,
    };

    const updatedPrompts = [...prompts, duplicatedPrompt];
    onPromptsChange(updatedPrompts);
    saveToLocalStorage(updatedPrompts);
  };

  const openEditDialog = (prompt: SystemPrompt) => {
    if (prompt.isBuiltIn) {
      handleDuplicatePrompt(prompt);
      return;
    }
    setEditingPrompt(prompt);
    setNewPromptName(prompt.name);
    setNewPromptContent(prompt.content);
    setErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSelectTemplate = (template: SystemPrompt) => {
    setNewPromptContent(template.content);
  };

  const userPrompts = prompts.filter((p) => !p.isBuiltIn);

  return (
    <div className="tw-max-h-[70vh] tw-overflow-y-auto tw-p-4">
      <div className="tw-space-y-6">
        {/* Create New Section */}
        <div className="tw-space-y-4 tw-rounded-lg tw-border tw-border-solid tw-border-border tw-p-4">
          <div className="tw-flex tw-items-center tw-gap-2 tw-text-xl tw-font-semibold">
            <Plus className="tw-mr-2 tw-size-4" />
            Create New Prompt
          </div>
          <div className="tw-space-y-3">
            <FormField label="Name" required error={!!errors.name} errorMessage={errors.name}>
              <Input
                placeholder="Enter prompt name. e.g:  My Custom Assistant"
                value={newPromptName}
                onChange={(e) => {
                  setNewPromptName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
            </FormField>
            <FormField
              label="Prompt"
              required
              error={!!errors.content}
              errorMessage={errors.content}
            >
              <div className="tw-relative">
                <Textarea
                  placeholder="Enter your system prompt here..."
                  value={newPromptContent}
                  onChange={(e) => {
                    setNewPromptContent(e.target.value);
                    setErrors((prev) => ({ ...prev, content: undefined }));
                  }}
                  rows={6}
                  className="tw-min-h-[80px] tw-w-full tw-pr-8"
                />
                <TooltipProvider>
                  <Popover>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="tw-absolute tw-right-2 tw-top-2"
                          >
                            <Sparkles className="tw-size-4" />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose from templates</p>
                      </TooltipContent>
                    </Tooltip>
                    <PopoverContent className="tw-w-80 tw-p-3" align="end" container={contentEl}>
                      <div className="tw-space-y-2">
                        <div className="tw-mb-2 tw-text-sm tw-font-medium">Choose a Template</div>
                        {BUILT_IN_TEMPLATES.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className="tw-flex tw-min-w-0  tw-items-center tw-gap-2 tw-truncate tw-rounded-lg tw-border tw-border-solid tw-border-border tw-p-2 tw-transition-colors hover:tw-bg-modifier-hover"
                          >
                            <div className="tw-flex tw-min-w-0 tw-flex-col">
                              <div className="tw-text-sm tw-font-medium">{template.name}</div>
                              <div className="tw-mt-0.5 tw-min-w-0  tw-flex-1 tw-truncate tw-text-xs tw-text-muted">
                                {template.content}
                              </div>
                            </div>
                            {template.exampleUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="tw-size-7 tw-shrink-0"
                                onClick={() => window.open(template.exampleUrl, "_blank")}
                                title="View prompt example"
                              >
                                <ExternalLink className="tw-size-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TooltipProvider>
              </div>
            </FormField>
            <Button onClick={handleCreatePrompt} className="tw-w-full">
              Create Prompt
            </Button>
            <div className="tw-mb-4 tw-flex tw-items-start tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-border tw-p-4 tw-text-muted">
              <Lightbulb className="tw-size-5" />{" "}
              <div>
                system prompts are automatically loaded from .md files in your system prompts folder{" "}
                <strong>{settings.userSystemPromptsFolder}</strong>. Modifying the files will also
                update the system prompt settings.
              </div>
            </div>
          </div>
        </div>

        <div className="tw-space-y-3">
          <div className="tw-text-xl tw-font-semibold">Your Prompts</div>
          <Separator />
          <div className="tw-space-y-2">
            {userPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="tw-space-y-2 tw-rounded-lg tw-border tw-border-solid tw-border-border tw-p-4"
              >
                <div className="tw-flex tw-items-start tw-justify-between tw-gap-2">
                  <div className="tw-min-w-0 tw-flex-1 tw-truncate">
                    <div className="tw-font-medium">{prompt.name}</div>
                    <div className="tw-mt-1 tw-line-clamp-2 tw-min-w-0 tw-flex-1  tw-truncate  tw-text-sm tw-text-muted">
                      {prompt.content}
                    </div>
                  </div>
                  <div className="tw-flex tw-gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicatePrompt(prompt)}
                      title="Duplicate"
                    >
                      <Copy className="tw-size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(prompt)}
                      title="Edit"
                    >
                      <Pencil className="tw-size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePrompt(prompt.id)}
                      title="Delete"
                    >
                      <Trash2 className="tw-size-4 tw-text-error" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog Section - Inline */}
      {isEditDialogOpen && editingPrompt && (
        <div className="tw-fixed tw-inset-0 tw-z-modal tw-flex tw-items-center tw-justify-center tw-bg-overlay/50">
          <div className="tw-max-w-2xl tw-rounded-lg tw-bg-primary tw-p-6 tw-shadow-lg">
            <h2 className="tw-mb-2 tw-text-lg tw-font-semibold">Edit System Prompt</h2>
            <p className="tw-mb-4 tw-text-sm tw-text-muted">Update your custom system prompt.</p>
            <div className="tw-space-y-4">
              <FormField label="Name" required error={!!errors.name} errorMessage={errors.name}>
                <Input
                  id="edit-name"
                  value={newPromptName}
                  onChange={(e) => {
                    setNewPromptName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                />
              </FormField>
              <FormField
                label="Content"
                required
                error={!!errors.content}
                errorMessage={errors.content}
              >
                <Textarea
                  id="edit-content"
                  value={newPromptContent}
                  onChange={(e) => {
                    setNewPromptContent(e.target.value);
                    setErrors((prev) => ({ ...prev, content: undefined }));
                  }}
                  rows={12}
                />
              </FormField>
              <div className="tw-flex tw-gap-2">
                <Button onClick={handleUpdatePrompt} className="tw-flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setEditingPrompt(null);
                    setIsEditDialogOpen(false);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export class SystemPromptManagerModal extends Modal {
  private root: Root;

  constructor(
    app: App,
    private prompts: SystemPrompt[],
    private onPromptsChange: (prompts: SystemPrompt[]) => void
  ) {
    super(app);
    // @ts-ignore
    this.setTitle("Manage System Prompts");
  }

  onOpen() {
    const { contentEl, modalEl } = this;

    // Mobile adaptation - occupy 80% height to leave clickable area
    if (Platform.isMobile) {
      modalEl.style.height = "80%";
    }

    this.root = createRoot(contentEl);

    this.root.render(
      <SystemPromptManagerDialogContent
        prompts={this.prompts}
        onPromptsChange={this.onPromptsChange}
        contentEl={contentEl}
        onClose={() => this.close()}
      />
    );
  }

  onClose() {
    this.root.unmount();
  }
}
