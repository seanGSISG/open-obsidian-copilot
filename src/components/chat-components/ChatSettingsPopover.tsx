import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
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
import { ParameterControl } from "@/components/ui/parameter-controls";
import { FormField } from "@/components/ui/form-field";
import {
  getCurrentModelParams,
  getParamRange,
  getParamDisplayValue,
  isParamApplicable,
  REASONING_EFFORT_OPTIONS,
  VERBOSITY_OPTIONS,
  getDefaultReasoningEffort,
  getDefaultVerbosity,
} from "@/utils/modelParamsHelper";
import { subscribeToModelKeyChange } from "@/aiParams";
import { subscribeToSettingsChange } from "@/settings/model";

interface ChatSettingsPopoverProps {
  onManagePrompts?: () => void;
}

export function ChatSettingsPopover({ onManagePrompts }: ChatSettingsPopoverProps) {
  // 获取当前模型参数
  const [modelParams, setModelParams] = useState(() => getCurrentModelParams());

  // 本地状态（用于 UI 交互）
  const [temperature, setTemperature] = useState(() =>
    getParamDisplayValue(modelParams, "temperature")
  );
  const [topP, setTopP] = useState(() => getParamDisplayValue(modelParams, "topP"));
  const [frequencyPenalty, setFrequencyPenalty] = useState(() =>
    getParamDisplayValue(modelParams, "frequencyPenalty")
  );
  const [reasoningEffort, setReasoningEffort] = useState<string | undefined>(() =>
    getParamDisplayValue(modelParams, "reasoningEffort")
  );
  const [verbosity, setVerbosity] = useState<string | undefined>(() =>
    getParamDisplayValue(modelParams, "verbosity")
  );
  const [systemPrompt, setSystemPrompt] = useState("default");
  const [allowOverride, setAllowOverride] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 统一的刷新函数：从 getCurrentModelParams() 重新读取所有参数
  const refreshParams = useCallback(() => {
    const newParams = getCurrentModelParams();
    setModelParams(newParams);
    setTemperature(getParamDisplayValue(newParams, "temperature"));
    setTopP(getParamDisplayValue(newParams, "topP"));
    setFrequencyPenalty(getParamDisplayValue(newParams, "frequencyPenalty"));
    setReasoningEffort(getParamDisplayValue(newParams, "reasoningEffort"));
    setVerbosity(getParamDisplayValue(newParams, "verbosity"));
  }, []);

  // 监听模型切换 - 刷新参数
  useEffect(() => {
    return subscribeToModelKeyChange(refreshParams);
  }, [refreshParams]);

  // 监听全局设置变化 - 刷新参数
  useEffect(() => {
    return subscribeToSettingsChange(refreshParams);
  }, [refreshParams]);

  const handleReset = () => {
    // 重置到当前模型的默认值
    refreshParams();
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

  // 获取参数范围
  const tempRange = getParamRange("temperature");
  const topPRange = getParamRange("topP");
  const freqPenaltyRange = getParamRange("frequencyPenalty");

  const { model, isReasoningModel } = modelParams;

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
              {isParamApplicable(model, "temperature") && !isReasoningModel && (
                <FormField>
                  <ParameterControl
                    type="slider"
                    optional={false}
                    label="Temperature"
                    value={temperature}
                    onChange={setTemperature}
                    min={tempRange.min}
                    max={tempRange.max}
                    step={tempRange.step}
                    defaultValue={tempRange.default}
                    helpText="Higher values = more creative, lower values = more focused"
                  />
                </FormField>
              )}

              {/* Reasoning model temperature notice */}
              {isReasoningModel && (
                <div className="tw-space-y-1.5">
                  <Label>Temperature</Label>
                  <div className="tw-rounded-md tw-bg-modifier-hover tw-p-2.5 tw-text-sm tw-text-muted">
                    Fixed at {temperature?.toFixed(1)} for reasoning models
                  </div>
                </div>
              )}

              {/* Top-P */}
              {isParamApplicable(model, "topP") && (
                <FormField>
                  <ParameterControl
                    type="slider"
                    optional={true}
                    label="Top-P"
                    value={topP}
                    onChange={setTopP}
                    disableFn={() => setTopP(getParamDisplayValue(modelParams, "topP"))}
                    min={topPRange.min}
                    max={topPRange.max}
                    step={topPRange.step}
                    defaultValue={topPRange.default}
                    helpText="Nucleus sampling. Smaller = less variety, larger = more diverse"
                  />
                </FormField>
              )}

              {/* Frequency Penalty */}
              {isParamApplicable(model, "frequencyPenalty") && (
                <FormField>
                  <ParameterControl
                    type="slider"
                    optional={true}
                    label="Frequency Penalty"
                    value={frequencyPenalty}
                    onChange={setFrequencyPenalty}
                    disableFn={() =>
                      setFrequencyPenalty(getParamDisplayValue(modelParams, "frequencyPenalty"))
                    }
                    min={freqPenaltyRange.min}
                    max={freqPenaltyRange.max}
                    step={freqPenaltyRange.step}
                    defaultValue={freqPenaltyRange.default}
                    helpText="Penalizes repeated words. Higher = less repetition"
                  />
                </FormField>
              )}

              {/* Reasoning Effort - Only for reasoning models */}
              {isParamApplicable(model, "reasoningEffort") && (
                <FormField>
                  <ParameterControl
                    type="select"
                    optional={true}
                    label="Reasoning Effort"
                    value={reasoningEffort}
                    onChange={setReasoningEffort}
                    disableFn={() =>
                      setReasoningEffort(getParamDisplayValue(modelParams, "reasoningEffort"))
                    }
                    defaultValue={getDefaultReasoningEffort()}
                    options={REASONING_EFFORT_OPTIONS}
                    helpText="Controls how much computational effort the model uses for reasoning. Higher = more thorough"
                  />
                </FormField>
              )}

              {/* Verbosity - Only for reasoning models */}
              {isParamApplicable(model, "verbosity") && (
                <FormField>
                  <ParameterControl
                    type="select"
                    optional={true}
                    label="Verbosity"
                    value={verbosity}
                    onChange={setVerbosity}
                    disableFn={() => setVerbosity(getParamDisplayValue(modelParams, "verbosity"))}
                    defaultValue={getDefaultVerbosity()}
                    options={VERBOSITY_OPTIONS}
                    helpText="Controls how detailed the model's reasoning process is. Higher = more detailed explanations"
                  />
                </FormField>
              )}

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
          {/*          <div className="tw-shrink-0 tw-rounded-md tw-bg-primary tw-px-4 tw-py-1">
            <div className="tw-text-xs tw-font-bold tw-leading-relaxed tw-text-normal">
              These settings override the global defaults for this chat session only.
            </div>
          </div>*/}
        </div>
      </PopoverContent>
    </Popover>
  );
}
