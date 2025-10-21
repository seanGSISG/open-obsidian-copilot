import React, { useState, useEffect } from "react";
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
} from "@/utils/modelParamsHelper";
import { subscribeToModelKeyChange } from "@/aiParams";
import { subscribeToSettingsChange } from "@/settings/model";

/**
 * 脏值追踪状态，用于标记用户是否手动修改过参数
 * true 表示用户修改过，不应被全局设置覆盖
 */
interface DirtyState {
  temperature: boolean;
  topP: boolean;
  frequencyPenalty: boolean;
  systemPrompt: boolean;
  allowOverride: boolean;
}

interface ChatSettingsPopoverProps {
  onManagePrompts?: () => void;
}

export function ChatSettingsPopover({ onManagePrompts }: ChatSettingsPopoverProps) {
  // 获取当前模型参数
  const [modelParams, setModelParams] = useState(() => getCurrentModelParams());

  // 本地状态（用于 UI 交互）
  const [temperature, setTemperature] = useState(getParamDisplayValue(modelParams, "temperature"));
  const [topP, setTopP] = useState(getParamDisplayValue(modelParams, "topP"));
  const [frequencyPenalty, setFrequencyPenalty] = useState(
    getParamDisplayValue(modelParams, "frequencyPenalty")
  );
  const [systemPrompt, setSystemPrompt] = useState("default");
  const [allowOverride, setAllowOverride] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  console.log(topP);

  // 脏值追踪：标记哪些参数被用户手动修改过
  const [dirtyFlags, setDirtyFlags] = useState<DirtyState>({
    temperature: false,
    topP: false,
    frequencyPenalty: false,
    systemPrompt: false,
    allowOverride: false,
  });

  // 监听模型切换
  useEffect(() => {
    const unsubscribe = subscribeToModelKeyChange(() => {
      const newParams = getCurrentModelParams();
      setModelParams(newParams);

      // 更新 UI 状态
      setTemperature(getParamDisplayValue(newParams, "temperature"));
      setTopP(getParamDisplayValue(newParams, "topP"));
      setFrequencyPenalty(getParamDisplayValue(newParams, "frequencyPenalty"));

      // 模型切换时清除所有脏标记（切换模型 = 全新开始）
      setDirtyFlags({
        temperature: false,
        topP: false,
        frequencyPenalty: false,
        systemPrompt: false,
        allowOverride: false,
      });
    });

    return unsubscribe;
  }, []);

  // 监听全局设置变化（只更新未被用户修改的参数）
  useEffect(() => {
    const unsubscribe = subscribeToSettingsChange(() => {
      const newParams = getCurrentModelParams();

      // 只更新未被用户手动修改的参数
      if (!dirtyFlags.temperature) {
        setTemperature(getParamDisplayValue(newParams, "temperature"));
      }
      if (!dirtyFlags.topP) {
        setTopP(getParamDisplayValue(newParams, "topP"));
      }
      if (!dirtyFlags.frequencyPenalty) {
        setFrequencyPenalty(getParamDisplayValue(newParams, "frequencyPenalty"));
      }

      // 更新 modelParams 引用（用于参数范围等）
      setModelParams(newParams);
    });

    return unsubscribe;
  }, [dirtyFlags]);

  const handleReset = () => {
    // 重置到当前模型的默认值
    const freshParams = getCurrentModelParams();
    setTemperature(getParamDisplayValue(freshParams, "temperature"));
    setTopP(getParamDisplayValue(freshParams, "topP"));
    setFrequencyPenalty(getParamDisplayValue(freshParams, "frequencyPenalty"));
    setSystemPrompt("default");
    setAllowOverride(false);
    setShowConfirmation(false);

    // 重置时清除所有脏标记，恢复"跟随全局默认"状态
    setDirtyFlags({
      temperature: false,
      topP: false,
      frequencyPenalty: false,
      systemPrompt: false,
      allowOverride: false,
    });
  };

  // 包装的参数更新函数，在更新值的同时标记脏值
  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
    setDirtyFlags((prev) => ({ ...prev, temperature: true }));
  };

  const handleTopPChange = (value: number) => {
    setTopP(value);
    setDirtyFlags((prev) => ({ ...prev, topP: true }));
  };

  const handleFrequencyPenaltyChange = (value: number) => {
    setFrequencyPenalty(value);
    setDirtyFlags((prev) => ({ ...prev, frequencyPenalty: true }));
  };

  const handleSystemPromptChange = (value: string) => {
    setSystemPrompt(value);
    setDirtyFlags((prev) => ({ ...prev, systemPrompt: true }));
  };

  // 禁用可选参数时的处理函数（恢复默认值并清除脏标记）
  const handleTopPDisable = () => {
    setTopP(getParamDisplayValue(modelParams, "topP"));
    setDirtyFlags((prev) => ({ ...prev, topP: false }));
  };

  const handleFrequencyPenaltyDisable = () => {
    setFrequencyPenalty(getParamDisplayValue(modelParams, "frequencyPenalty"));
    setDirtyFlags((prev) => ({ ...prev, frequencyPenalty: false }));
  };

  const handleOverrideToggle = (checked: boolean) => {
    if (checked) {
      setShowConfirmation(true);
    } else {
      setAllowOverride(false);
      setShowConfirmation(false);
    }
    setDirtyFlags((prev) => ({ ...prev, allowOverride: true }));
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
                    <Select value={systemPrompt} onValueChange={handleSystemPromptChange}>
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
                    onChange={handleTemperatureChange}
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
                    Fixed at {temperature.toFixed(1)} for reasoning models
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
                    onChange={handleTopPChange}
                    disableFn={handleTopPDisable}
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
                    onChange={handleFrequencyPenaltyChange}
                    disableFn={handleFrequencyPenaltyDisable}
                    min={freqPenaltyRange.min}
                    max={freqPenaltyRange.max}
                    step={freqPenaltyRange.step}
                    defaultValue={freqPenaltyRange.default}
                    helpText="Penalizes repeated words. Higher = less repetition"
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
