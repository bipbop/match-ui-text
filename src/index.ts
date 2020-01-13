type Callback = (payload: string, node: HTMLElement) => void;
type Validator = (payload: string, target: Text, match: RegExpExecArray) => boolean;

export const ReplaceElement = "x-replace-ui";

function deepUiText(
    useTag: string = ReplaceElement,
    excludeElements: string[],
    child: HTMLElement,
    regex: RegExp,
    callback: Callback,
    validate?: Validator
) {
    if (excludeElements.indexOf(child.tagName.toLowerCase()) !== -1) return;
    replaceText(regex, callback, validate, child, useTag, excludeElements);
}

function replaceTextWithNode(textChild: Text, regex: RegExp, callback: Callback, validate?: Validator) {
    var match: RegExpExecArray | null;
    while ((match = regex.exec(textChild.data)) !== null) {
        if (textChild.parentElement == null) continue;

        let [ payload ] = match;
        if (typeof validate !== "undefined" && !validate(payload, textChild, match as RegExpExecArray)) return;
        var messageBegin = textChild.data.substr(0, match.index);
        var messageEnd = textChild.data.substr(match.index + payload.length);
        var newElement = document.createElement(ReplaceElement);

        /* message begin */
        textChild.data = messageBegin;

        /* payload */
        newElement.innerText = payload;
        textChild.parentElement.append(newElement);
        textChild.parentElement.append(new Text(messageEnd));

        callback(payload, newElement);
    }
    regex.lastIndex = 0;
    return textChild;
}

export function replaceText(
    regex: RegExp,
    callback: Callback,
    validate?: Validator,
    node: Node = document.body,
    useTag: string = ReplaceElement,
    excludeElements: string[] = [
        'script',
        'style',
        'iframe',
        'canvas',
        'button',
        'textarea',
        useTag
    ]
) {
    let child = node.firstChild;
    while (child) {
        switch (child.nodeType) {
            case Node.ELEMENT_NODE:
                deepUiText(useTag, excludeElements, child as HTMLElement, regex, callback, validate);
                break;
            case Node.TEXT_NODE:
                replaceTextWithNode(child as Text, regex, callback, validate);
                break;
        }
        child = child.nextSibling;
    }

    return node;
}

export default replaceText;