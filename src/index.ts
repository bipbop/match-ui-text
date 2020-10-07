type Callback = (payload: string, node: HTMLElement) => HTMLElement | void;
type Validator = (payload: string, target: Text, match: RegExpExecArray) => boolean;

export const DEFAULT_ELEMENT = "x-replace-ui";

function tagDeepening(
    useTag: string = DEFAULT_ELEMENT,
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

function replaceTextElement(
  useTag: string = DEFAULT_ELEMENT,
  textChild: Text,
  regex: RegExp,
  callback: Callback,
  validate?: Validator
) {
    let match: RegExpExecArray | null;
    while (true) {
        match = regex.exec(textChild.data);
        if (match === null) { break; }
        if (textChild.parentElement === null) { continue; }

        const [ payload ] = match;
        const messageBegin = textChild.data.substr(0, match.index);
        const messageEnd = textChild.data.substr(match.index + payload.length);
        const newElement = document.createElement(useTag);

        /* message begin */
        textChild.data = messageBegin;

        /* payload */
        textChild.parentElement.append(newElement);
        textChild.parentElement.append(new Text(messageEnd));

        if (typeof validate !== "undefined" && !validate(payload, textChild, match as RegExpExecArray)) {
          newElement.innerText = payload
          return;
        }

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
    useTag: string = DEFAULT_ELEMENT,
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
                replaceTextElement(useTag, child as Text, regex, callback, validate);
                break;
        }
        child = child.nextSibling;
    }

    return node;
}

export default replaceElement
