"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var customTag = "x-replace-ui";
function deepUiText(excludeElements, child, regex, callback, validate) {
    if (excludeElements.includes(child.tagName.toLowerCase()))
        return;
    replaceDocumentText(regex, callback, validate, child, excludeElements);
}
function replaceText(textChild, regex, callback, validate) {
    var match;
    while ((match = regex.exec(textChild.data)) !== null) {
        if (textChild.parentElement == null)
            continue;
        var payload = match[0];
        if (typeof validate !== "undefined" && !validate(payload, textChild, match))
            return;
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
function replaceDocumentText(regex, callback, validate, node, excludeElements) {
    if (node === void 0) { node = document.body; }
    if (excludeElements === void 0) { excludeElements = ['script', 'style', 'iframe', 'canvas', customTag]; }
    var child = node.firstChild;
    while (child) {
        switch (child.nodeType) {
            case Node.ELEMENT_NODE:
                deepUiText(excludeElements, child, regex, callback, validate);
                break;
            case Node.TEXT_NODE:
                replaceText(child, regex, callback, validate);
                break;
        }
        child = child.nextSibling;
    }
    return node;
}
exports.default = replaceDocumentText;
//# sourceMappingURL=index.js.map