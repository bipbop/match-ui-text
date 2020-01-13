type Callback = (node: HTMLElement, payload: string) => void;
type Validator = (payload: string, target?: Text, match?: RegExpExecArray) => boolean;

const customTag = "x-replace-ui";

function deepUiText(
    excludeElements: string[],
    child: HTMLElement,
    regex: RegExp,
    callback: Callback,
    validate?: Validator
) {
    if (excludeElements.includes(child.tagName.toLowerCase())) return;
    replaceDocumentText(regex, callback, validate, child, excludeElements);
}

function replaceText(textChild: Text, regex: RegExp, callback: Callback, validate?: Validator) {
    var match: RegExpExecArray | null;
    while ((match = regex.exec(textChild.data)) !== null) {
        if (textChild.parentElement == null) continue;

        let [ payload ] = match;
        if (typeof validate !== "undefined" && !validate(payload, textChild, match as RegExpExecArray)) return;
        var messageBegin = textChild.data.substr(0, match.index);
        var messageEnd = textChild.data.substr(match.index + payload.length);
        var newElement = document.createElement(customTag);

        /* message begin */
        textChild.data = messageBegin;

        /* payload */
        newElement.innerText = payload;
        textChild.parentElement.append(newElement);
        textChild.parentElement.append(new Text(messageEnd));

        callback(newElement, payload);
    }
    regex.lastIndex = 0;
    return textChild;
}

export default function replaceDocumentText(
    regex: RegExp,
    callback: Callback,
    validate?: Validator,
    node: Node = document.body,
    excludeElements: string[] = ['script', 'style', 'iframe', 'canvas', customTag]
) {

    let child = node.firstChild;
    while (child) {
        switch (child.nodeType) {
            case Node.ELEMENT_NODE:
                deepUiText(excludeElements, child as HTMLElement, regex, callback, validate);
                break;
            case Node.TEXT_NODE:
                replaceText(child as Text, regex, callback, validate);
                break;
        }
        child = child.nextSibling;
    }

    return node;
}



