declare type Callback = (payload: string, node?: HTMLElement) => HTMLElement | undefined;
declare type Validator = (payload: string, target: Text, match: RegExpExecArray) => boolean;
export declare const EncapsulationElement = "x-replace-ui";
export declare function replaceElement(regex: RegExp, callback: Callback, validate?: Validator, node?: Node, useTag?: string, excludeElements?: string[]): Node;
export default replaceElement;
