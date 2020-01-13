declare type Callback = (payload: string, node: HTMLElement) => void;
declare type Validator = (payload: string, target: Text, match: RegExpExecArray) => boolean;
export declare const ReplaceElement = "x-replace-ui";
export declare function replaceText(regex: RegExp, callback: Callback, validate?: Validator, node?: Node, useTag?: string, excludeElements?: string[]): Node;
export default replaceText;
