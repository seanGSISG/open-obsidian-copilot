import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink, Lightbulb, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface SystemPromptManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompts: SystemPrompt[];
  onPromptsChange: (prompts: SystemPrompt[]) => void;
}

export function SystemPromptManagerDialog({
  open,
  onOpenChange,
  prompts,
  onPromptsChange,
}: SystemPromptManagerDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptContent, setNewPromptContent] = useState("");

  const saveToLocalStorage = (updatedPrompts: SystemPrompt[]) => {
    const customPrompts = updatedPrompts.filter((p) => !p.isBuiltIn);
    localStorage.setItem("systemPrompts", JSON.stringify(customPrompts));
  };

  const handleCreatePrompt = () => {
    if (!newPromptName.trim() || !newPromptContent.trim()) {
      return;
    }

    const newPrompt: SystemPrompt = {
      id: `custom-${Date.now()}`,
      name: newPromptName,
      content: newPromptContent,
      isBuiltIn: false,
    };

    const updatedPrompts = [...prompts, newPrompt];
    onPromptsChange(updatedPrompts);
    saveToLocalStorage(updatedPrompts);

    setNewPromptName("");
    setNewPromptContent("");
  };

  const handleUpdatePrompt = () => {
    if (!editingPrompt || !newPromptName.trim() || !newPromptContent.trim()) {
      return;
    }

    const updatedPrompts = prompts.map((p) =>
      p.id === editingPrompt.id ? { ...p, name: newPromptName, content: newPromptContent } : p
    );

    onPromptsChange(updatedPrompts);
    saveToLocalStorage(updatedPrompts);

    setEditingPrompt(null);
    setNewPromptName("");
    setNewPromptContent("");
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
    setIsEditDialogOpen(true);
  };

  const handleSelectTemplate = (template: SystemPrompt) => {
    setNewPromptContent(template.content);
  };

  const userPrompts = prompts.filter((p) => !p.isBuiltIn);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="tw-max-h-[80vh] tw-max-w-3xl tw-overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage System Prompts</DialogTitle>
            <DialogDescription>
              Create and manage your custom system prompts. Built-in templates can be duplicated for
              customization.
            </DialogDescription>
          </DialogHeader>

          <div className="tw-space-y-6">
            {/* Create New Section */}
            <div className="tw-space-y-4 tw-rounded-lg tw-border tw-p-4">
              <h3 className="tw-flex tw-items-center tw-gap-2 tw-font-semibold">
                <Plus className="tw-mr-2 tw-size-4" />
                Create New Prompt
              </h3>
              <div className="tw-space-y-3">
                <div>
                  <Label htmlFor="new-name">Name</Label>
                  <Input
                    id="new-name"
                    placeholder="e.g., My Custom Assistant"
                    value={newPromptName}
                    onChange={(e) => setNewPromptName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="new-content">Content</Label>
                  <div className="tw-relative">
                    <Textarea
                      id="new-content"
                      placeholder="Enter your system prompt here..."
                      value={newPromptContent}
                      onChange={(e) => setNewPromptContent(e.target.value)}
                      rows={6}
                      className="tw-pr-12"
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
                        <PopoverContent className="tw-w-80 tw-p-3" align="end">
                          <div className="tw-space-y-2">
                            <h4 className="tw-mb-2 tw-text-sm tw-font-medium">Choose a Template</h4>
                            {BUILT_IN_TEMPLATES.map((template) => (
                              <div
                                key={template.id}
                                className="tw-flex tw-items-center tw-gap-2 tw-rounded-lg tw-border tw-p-2 tw-transition-colors hover:tw-bg-muted/50"
                              >
                                <button
                                  onClick={() => handleSelectTemplate(template)}
                                  className="tw-flex-1 tw-text-left"
                                >
                                  <h5 className="tw-text-sm tw-font-medium">{template.name}</h5>
                                  <p className="tw-mt-0.5 tw-line-clamp-1 tw-text-xs tw-text-muted">
                                    {template.content}
                                  </p>
                                </button>
                                {template.exampleUrl && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="tw-size-7 tw-shrink-0"
                                    onClick={() => window.open(template.exampleUrl, "_blank")}
                                    title="View example"
                                  >
                                    <ExternalLink className="tw-size-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TooltipProvider>
                  </div>
                </div>
                <Button onClick={handleCreatePrompt} className="tw-w-full">
                  Create Prompt
                </Button>
                <div className="tw-flex tw-gap-2 tw-rounded-lg tw-p-3 tw-text-sm tw-text-muted tw-bg-muted/50">
                  <Lightbulb className="tw-mt-0.5 tw-size-4 tw-shrink-0" />
                  <p>
                    Created prompts will be saved to{" "}
                    <code className="tw-font-mono">copilot/system-prompt</code>.
                  </p>
                </div>
              </div>
            </div>

            {userPrompts.length > 0 && (
              <div className="tw-space-y-3">
                <h3 className="tw-font-semibold">Your Prompts</h3>
                <div className="tw-space-y-2">
                  {userPrompts.map((prompt) => (
                    <div key={prompt.id} className="tw-space-y-2 tw-rounded-lg tw-border tw-p-4">
                      <div className="tw-flex tw-items-start tw-justify-between tw-gap-2">
                        <div className="tw-min-w-0 tw-flex-1">
                          <h4 className="tw-font-medium">{prompt.name}</h4>
                          <p className="tw-mt-1 tw-line-clamp-2 tw-text-sm tw-text-muted">
                            {prompt.content}
                          </p>
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
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="tw-max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit System Prompt</DialogTitle>
            <DialogDescription>Update your custom system prompt.</DialogDescription>
          </DialogHeader>
          <div className="tw-space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={newPromptName}
                onChange={(e) => setNewPromptName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={newPromptContent}
                onChange={(e) => setNewPromptContent(e.target.value)}
                rows={12}
              />
            </div>
            <div className="tw-flex tw-gap-2">
              <Button onClick={handleUpdatePrompt} className="tw-flex-1">
                Save Changes
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setEditingPrompt(null);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
