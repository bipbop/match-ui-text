type Callback = (payload: string, node: HTMLElement) => HTMLElement | void;
type Validator = (payload: string, target: Text, match: RegExpExecArray) => boolean;

export const EncapsulationElement = "x-replace-ui";

function tagDeepening(
    useTag: string = EncapsulationElement,
    excludeElements: string[],
    child: HTMLElement,
    regex: RegExp,
    callback: Callback,
    validate?: Validator,
) {
    if (excludeElements.indexOf(child.tagName.toLowerCase()) !== -1) {
        return;
    }
    replaceElement(regex, callback, validate, child, useTag, excludeElements);
}

function replaceTextElement(textChild: Text, regex: RegExp, callback: Callback, validate?: Validator) {
    let match: RegExpExecArray | null;
    while (true) {
        match = regex.exec(textChild.data);
        if (match === null) { break; }
        if (textChild.parentElement === null) { continue; }

        const [ payload ] = match;
        if (typeof validate !== "undefined" && !validate(payload, textChild, match as RegExpExecArray)) { return; }
        const messageBegin = textChild.data.substr(0, match.index);
        const messageEnd = textChild.data.substr(match.index + payload.length);
        const newElement = document.createElement(EncapsulationElement);

        /* message begin */
        textChild.data = messageBegin;

        /* payload */
        textChild.parentElement.append(newElement);
        textChild.parentElement.append(new Text(messageEnd));

        const callbackNode = callback(payload, newElement);
        if (callbackNode) { newElement.append(callbackNode); } else { newElement.innerText = payload; }
    }
    regex.lastIndex = 0;
    return textChild;
}

export function replaceElement(
    regex: RegExp,
    callback: Callback,
    validate?: Validator,
    node: Node = document.body,
    useTag: string = EncapsulationElement,
    excludeElements: string[] = [
        "script",
        "style",
        "iframe",
        "canvas",
        "button",
        "textarea",
        useTag,
    ],
) {
    let child = node.firstChild;
    while (child) {
        switch (child.nodeType) {
            case Node.ELEMENT_NODE:
                tagDeepening(useTag, excludeElements, child as HTMLElement, regex, callback, validate);
                break;
            case Node.TEXT_NODE:
                replaceTextElement(child as Text, regex, callback, validate);
                break;
        }
        child = child.nextSibling;
    }

    return node;
}

export default replaceElement;
