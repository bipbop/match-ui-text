declare type Callback = (node: HTMLElement, payload: string) => void;
declare type Validator = (payload: string, target?: Text, match?: RegExpExecArray) => boolean;
export default function replaceDocumentText(regex: RegExp, callback: Callback, validate?: Validator, node?: Node, excludeElements?: string[]): Node;
export {};
