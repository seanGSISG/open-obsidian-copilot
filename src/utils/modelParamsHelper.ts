import { CustomModel } from "@/aiParams";
import { ChatModelProviders, DEFAULT_MODEL_SETTING, ReasoningEffort, Verbosity } from "@/constants";
import { CopilotSettings, getSettings } from "@/settings/model";
import { getModelInfo } from "@/utils";
import { getModelKey } from "@/aiParams";

/**
 * 模型参数配置接口
 * 添加新参数时只需在这里扩展
 */
export interface ModelParams {
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  maxTokens?: number;
  reasoningEffort?: ReasoningEffort;
  verbosity?: Verbosity;
  // 未来可以添加新参数：
  // presencePenalty?: number;
  // repetitionPenalty?: number;
}

/**
 * 参数的范围配置
 */
export interface ParamRanges {
  temperature: { min: number; max: number; step: number; default: number };
  topP: { min: number; max: number; step: number; default: number };
  frequencyPenalty: { min: number; max: number; step: number; default: number };
  maxTokens: { min: number; max: number; step: number; default: number };
}

/**
 * 默认参数范围
 * 使用 DEFAULT_MODEL_SETTING 作为系统级默认值
 */
export const DEFAULT_PARAM_RANGES: ParamRanges = {
  temperature: {
    min: 0,
    max: 2,
    step: 0.01,
    default: DEFAULT_MODEL_SETTING.TEMPERATURE,
  },
  topP: { min: 0, max: 1, step: 0.05, default: 0.9 },
  frequencyPenalty: { min: 0, max: 2, step: 0.05, default: 0 },
  maxTokens: {
    min: 100,
    max: 128000,
    step: 100,
    default: DEFAULT_MODEL_SETTING.MAX_TOKENS,
  },
};

/**
 * Provider 支持的参数映射
 * 用于判断某个参数是否对当前 provider 可用
 */
const PROVIDER_SUPPORTED_PARAMS: Record<ChatModelProviders, Set<keyof ModelParams>> = {
  [ChatModelProviders.OPENAI]: new Set([
    "temperature",
    "topP",
    "frequencyPenalty",
    "maxTokens",
    "reasoningEffort",
    "verbosity",
  ]),
  [ChatModelProviders.AZURE_OPENAI]: new Set([
    "temperature",
    "topP",
    "frequencyPenalty",
    "maxTokens",
    "reasoningEffort",
    "verbosity",
  ]),
  [ChatModelProviders.ANTHROPIC]: new Set(["temperature", "topP", "maxTokens"]),
  [ChatModelProviders.GOOGLE]: new Set(["temperature", "topP", "maxTokens"]),
  [ChatModelProviders.COHEREAI]: new Set(["temperature", "maxTokens"]),
  [ChatModelProviders.XAI]: new Set(["temperature", "maxTokens"]),
  [ChatModelProviders.OPENROUTERAI]: new Set([
    "temperature",
    "topP",
    "frequencyPenalty",
    "maxTokens",
  ]),
  [ChatModelProviders.OLLAMA]: new Set(["temperature", "topP", "frequencyPenalty", "maxTokens"]),
  [ChatModelProviders.LM_STUDIO]: new Set(["temperature", "topP", "frequencyPenalty", "maxTokens"]),
  [ChatModelProviders.GROQ]: new Set(["temperature", "maxTokens"]),
  [ChatModelProviders.OPENAI_FORMAT]: new Set([
    "temperature",
    "topP",
    "frequencyPenalty",
    "maxTokens",
    "reasoningEffort",
    "verbosity",
  ]),
  [ChatModelProviders.COPILOT_PLUS]: new Set([
    "temperature",
    "topP",
    "frequencyPenalty",
    "maxTokens",
  ]),
  [ChatModelProviders.MISTRAL]: new Set(["temperature", "topP", "frequencyPenalty", "maxTokens"]),
  [ChatModelProviders.DEEPSEEK]: new Set(["temperature", "topP", "frequencyPenalty", "maxTokens"]),
};

/**
 * 获取当前选中模型的参数配置
 * 这是主要的对外接口
 */
export function getCurrentModelParams(): ModelParams & {
  model: CustomModel | undefined;
  supportedParams: Set<keyof ModelParams>;
  isReasoningModel: boolean;
} {
  const settings = getSettings();
  const modelKey = getModelKey();

  // 找到当前选中的模型
  const currentModel = settings.activeModels.find(
    (model) => `${model.name}|${model.provider}` === modelKey
  );

  if (!currentModel) {
    // 如果没有找到，返回默认配置
    return {
      ...getDefaultParams(settings),
      model: undefined,
      supportedParams: new Set(),
      isReasoningModel: false,
    };
  }

  const params = getModelParamsWithDefaults(currentModel, settings);
  const supportedParams = getSupportedParams(currentModel.provider as ChatModelProviders);
  const modelInfo = getModelInfo(currentModel.name);

  return {
    ...params,
    model: currentModel,
    supportedParams,
    isReasoningModel: modelInfo.isThinkingEnabled || modelInfo.isOSeries || modelInfo.isGPT5,
  };
}

/**
 * 从 CustomModel 和全局设置中提取参数配置
 * 两层优先级：model-specific → global settings
 */
export function getModelParamsWithDefaults(
  model: CustomModel,
  settings: CopilotSettings
): ModelParams {
  const modelInfo = getModelInfo(model.name);

  // 处理特殊模型的 temperature
  let temperature: number | undefined;
  if (modelInfo.isThinkingEnabled) {
    // Thinking-enabled models 不接受 temperature
    temperature = undefined;
  } else if (modelInfo.isOSeries || modelInfo.isGPT5) {
    // O-series 和 GPT-5 要求 temperature = 1
    temperature = 1;
  } else {
    // 普通模型使用配置的 temperature：model-specific → global settings
    temperature = model.temperature ?? settings.temperature;
  }

  return {
    temperature,
    // topP 只在 model 中定义（settings 中没有该字段）
    topP: model.topP,
    // frequencyPenalty 只在 model 中定义（settings 中没有该字段）
    frequencyPenalty: model.frequencyPenalty,
    // maxTokens：model-specific → global settings
    maxTokens: model.maxTokens ?? settings.maxTokens,
    // reasoning models 专用参数（只在 model 中定义）
    reasoningEffort: model.reasoningEffort,
    verbosity: model.verbosity,
  };
}

/**
 * 获取默认参数（当没有选中模型时使用）
 * 直接使用全局 settings 的值
 */
export function getDefaultParams(settings: CopilotSettings): ModelParams {
  return {
    temperature: settings.temperature,
    topP: undefined, // settings 中没有 topP
    frequencyPenalty: undefined, // settings 中没有 frequencyPenalty
    maxTokens: settings.maxTokens,
    reasoningEffort: undefined, // settings 中没有 reasoningEffort
    verbosity: undefined, // settings 中没有 verbosity
  };
}

/**
 * 获取参数的有效范围
 * @param paramName 参数名称
 * @returns 参数的范围配置
 */
export function getParamRange<K extends keyof ParamRanges>(paramName: K): ParamRanges[K] {
  return DEFAULT_PARAM_RANGES[paramName];
}

/**
 * 获取指定 provider 支持的参数列表
 */
export function getSupportedParams(provider: ChatModelProviders): Set<keyof ModelParams> {
  return PROVIDER_SUPPORTED_PARAMS[provider] || new Set();
}

/**
 * 检查某个参数是否被当前 provider 支持
 */
export function isParamSupported(
  provider: ChatModelProviders,
  paramName: keyof ModelParams
): boolean {
  const supportedParams = getSupportedParams(provider);
  return supportedParams.has(paramName);
}

/**
 * Reasoning effort 选项配置
 * todo 支持部分模型支持 minimal
 */
export const REASONING_EFFORT_OPTIONS = [
  { value: ReasoningEffort.MINIMAL, label: "Minimal" },
  { value: ReasoningEffort.LOW, label: "Low" },
  { value: ReasoningEffort.MEDIUM, label: "Medium" },
  { value: ReasoningEffort.HIGH, label: "High" },
];

/**
 * Verbosity 选项配置
 */
export const VERBOSITY_OPTIONS = [
  { value: Verbosity.LOW, label: "Low" },
  { value: Verbosity.MEDIUM, label: "Medium" },
  { value: Verbosity.HIGH, label: "High" },
];

/**
 * 获取 reasoningEffort 的默认值
 * todo 默认值应该也和 getParamRange 放到一起
 */
export function getDefaultReasoningEffort(): ReasoningEffort {
  return DEFAULT_MODEL_SETTING.REASONING_EFFORT;
}

/**
 * 获取 verbosity 的默认值
 */
export function getDefaultVerbosity(): Verbosity {
  return DEFAULT_MODEL_SETTING.VERBOSITY;
}

/**
 * 获取参数的显示值（用于 UI 显示）- 数字类型参数的重载
 */
export function getParamDisplayValue(
  params: ModelParams,
  paramName: "temperature" | "topP" | "frequencyPenalty" | "maxTokens"
): number | undefined;

/**
 * 获取参数的显示值（用于 UI 显示）- 字符串类型参数的重载
 */
export function getParamDisplayValue(
  params: ModelParams,
  paramName: "reasoningEffort" | "verbosity"
): string | undefined;

/**
 * 获取参数的显示值（用于 UI 显示）- 实现
 * 如果参数未定义，返回 undefined（表示参数未启用）
 */
export function getParamDisplayValue<K extends keyof ModelParams>(
  params: ModelParams,
  paramName: K
): ModelParams[K] {
  return params[paramName];
}

/**
 * 检查参数是否适用于当前模型
 * 考虑 provider 支持性和模型类型（如 reasoning models）
 */
export function isParamApplicable(
  model: CustomModel | undefined,
  paramName: keyof ModelParams
): boolean {
  if (!model) return false;

  const provider = model.provider as ChatModelProviders;
  const modelInfo = getModelInfo(model.name);
  const isReasoningModel = modelInfo.isThinkingEnabled || modelInfo.isOSeries || modelInfo.isGPT5;

  // Temperature 对 thinking-enabled models 不适用
  if (paramName === "temperature" && modelInfo.isThinkingEnabled) {
    return false;
  }

  // Reasoning-specific 参数只对 O-series 和 GPT-5 models 适用
  if (paramName === "reasoningEffort" || paramName === "verbosity") {
    return isReasoningModel && (modelInfo.isOSeries || modelInfo.isGPT5);
  }

  // 检查 provider 是否支持该参数
  return isParamSupported(provider, paramName);
}
