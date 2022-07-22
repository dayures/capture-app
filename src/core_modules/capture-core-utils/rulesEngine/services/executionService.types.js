// @flow
import type { D2Functions, D2FunctionConfig } from '../rulesEngine.types';

export type LogError = (error: string) => void;
export type ExpressionSet = $ReadOnly<{|
    expression: string,
    expressionModuloStrings: string,
|}>;

type InternalD2FunctionConfig = $ReadOnly<{|
    name: string,
    ...D2FunctionConfig,
|}>;

export type DhisFunctionsInfo = $ReadOnly<{|
    dhisFunctionsObject: D2Functions,
    applicableDhisFunctions: Array<InternalD2FunctionConfig>,
|}>;
