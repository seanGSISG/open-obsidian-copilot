import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, RotateCcw, Settings, Settings2 } from "lucide-react";
import { SettingSwitch } from "@/components/ui/setting-switch";

interface ChatSettingsPopoverProps {
  onManagePrompts?: () => void;
}

export function ChatSettingsPopover({ onManagePrompts }: ChatSettingsPopoverProps) {
  const [temperature, setTemperature] = useState([0.7]);
  const [topP, setTopP] = useState([0.9]);
  const [frequencyPenalty, setFrequencyPenalty] = useState([0]);
  const [systemPrompt, setSystemPrompt] = useState("default");
  const [allowOverride, setAllowOverride] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReset = () => {
    setTemperature([0.7]);
    setTopP([0.9]);
    setFrequencyPenalty([0]);
    setSystemPrompt("default");
    setAllowOverride(false);
    setShowConfirmation(false);
  };

  const handleOverrideToggle = (checked: boolean) => {
    if (checked) {
      setShowConfirmation(true);
    } else {
      setAllowOverride(false);
      setShowConfirmation(false);
    }
  };

  const confirmOverride = () => {
    setAllowOverride(true);
    setShowConfirmation(false);
  };

  const cancelOverride = () => {
    setShowConfirmation(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost2" size="icon" title="Open Chat Setting">
          <Settings className="tw-size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="tw-w-80 tw-rounded-md tw-p-0" align="end">
        <div className="tw-flex tw-max-h-[500px] tw-flex-col">
          {/* Header with Reset - Fixed */}
          <div className="tw-shrink-0 tw-border-b tw-px-4">
            <div className="tw-flex tw-items-center tw-justify-between">
              <h3 className="tw-font-semibold">Chat Settings</h3>
              <Button variant="ghost" size="sm" onClick={handleReset} className="tw-h-8 tw-text-xs">
                <RotateCcw className="tw-mr-1 tw-size-3" />
                Reset
              </Button>
            </div>
          </div>

          <Separator />

          {/* Scrollable Content Area */}
          <ScrollArea className="tw-flex-1 tw-overflow-y-auto">
            <div className="tw-space-y-4 tw-p-4">
              {/* System Prompt */}
              <div className="tw-space-y-2">
                <div className="tw-flex tw-flex-col tw-gap-2 sm:tw-flex-row sm:tw-items-center sm:tw-justify-between">
                  <Label htmlFor="system-prompt" className="tw-text-sm sm:tw-min-w-fit">
                    System Prompt
                  </Label>
                  <div className="tw-flex tw-items-center tw-gap-2 sm:tw-flex-1">
                    <Select value={systemPrompt} onValueChange={setSystemPrompt}>
                      <SelectTrigger id="system-prompt" className="tw-flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="precise">Precise</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="tw-size-9 tw-shrink-0"
                      onClick={onManagePrompts}
                    >
                      <Settings2 className="tw-size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="tw-space-y-2">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="tw-text-sm tw-text-muted">{temperature[0].toFixed(2)}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.01}
                  value={temperature}
                  onValueChange={setTemperature}
                />
              </div>

              {/* Top-P */}
              <div className="tw-space-y-2">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <Label htmlFor="top-p">Top-P</Label>
                  <span className="tw-text-sm tw-text-muted">{topP[0].toFixed(2)}</span>
                </div>
                <Slider
                  id="top-p"
                  min={0}
                  max={1}
                  step={0.01}
                  value={topP}
                  onValueChange={setTopP}
                />
              </div>

              {/* Frequency Penalty */}
              <div className="tw-space-y-2">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <Label htmlFor="frequency-penalty">Frequency Penalty</Label>
                  <span className="tw-text-sm tw-text-muted">{frequencyPenalty[0].toFixed(2)}</span>
                </div>
                <Slider
                  id="frequency-penalty"
                  min={-2}
                  max={2}
                  step={0.01}
                  value={frequencyPenalty}
                  onValueChange={setFrequencyPenalty}
                />
              </div>

              <Separator />

              {/* Override Warning */}
              <div className="tw-space-y-3">
                <div className="tw-space-y-1.5">
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Label htmlFor="override" className="tw-text-sm tw-font-medium">
                      Override Builtin System Prompt
                    </Label>
                    <SettingSwitch
                      checked={allowOverride}
                      onCheckedChange={handleOverrideToggle}
                      disabled={showConfirmation}
                    />
                  </div>
                  <div className="tw-pr-12 tw-text-xs tw-leading-relaxed tw-text-muted">
                    Allows override builtin system prompt.{" "}
                    <span className="tw-text-xs tw-text-error">
                      WARNING: This may break expected functionality.
                    </span>
                  </div>
                </div>

                {(allowOverride || showConfirmation) && (
                  <div className="tw-rounded-md tw-border tw-bg-error/10 tw-p-3 tw-border-error/50">
                    <div className="tw-flex tw-gap-2">
                      <AlertTriangle className="tw-mt-0.5 tw-size-4 tw-shrink-0 tw-text-error" />
                      <div className="tw-flex-1 tw-space-y-2">
                        <div className="tw-space-y-1">
                          <div className="tw-text-xs tw-font-semibold tw-text-error">
                            Copilot Plus Feature becomes unavailable
                          </div>
                          <div className="tw-text-xs tw-leading-relaxed tw-text-muted">
                            When you open it, advanced features such as vault search, web search,
                            and agent mode will become unavailable.
                          </div>
                        </div>

                        {showConfirmation && (
                          <div className="tw-flex tw-gap-2 tw-pt-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={confirmOverride}
                              className="tw-h-7 tw-text-xs"
                            >
                              Enable Override
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelOverride}
                              className="tw-h-7 tw-bg-transparent tw-text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <Separator />

          {/* Footer - Fixed */}
          <div className="tw-shrink-0 tw-rounded-md tw-bg-primary tw-px-4 tw-py-1">
            <div className="tw-text-xs tw-font-bold tw-leading-relaxed tw-text-normal">
              These settings override the global defaults for this chat session only.
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
