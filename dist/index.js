"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceElement = "x-replace-ui";
function deepUiText(useTag, excludeElements, child, regex, callback, validate) {
    if (useTag === void 0) { useTag = exports.ReplaceElement; }
    if (excludeElements.indexOf(child.tagName.toLowerCase()) !== -1)
        return;
    replaceText(regex, callback, validate, child, useTag, excludeElements);
}
function replaceTextWithNode(textChild, regex, callback, validate) {
    var match;
    while ((match = regex.exec(textChild.data)) !== null) {
        if (textChild.parentElement == null)
            continue;
        var payload = match[0];
        if (typeof validate !== "undefined" && !validate(payload, textChild, match))
            return;
        var messageBegin = textChild.data.substr(0, match.index);
        var messageEnd = textChild.data.substr(match.index + payload.length);
        var newElement = document.createElement(exports.ReplaceElement);
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
function replaceText(regex, callback, validate, node, useTag, excludeElements) {
    if (node === void 0) { node = document.body; }
    if (useTag === void 0) { useTag = exports.ReplaceElement; }
    if (excludeElements === void 0) { excludeElements = [
        'script',
        'style',
        'iframe',
        'canvas',
        'button',
        'textarea',
        useTag
    ]; }
    var child = node.firstChild;
    while (child) {
        switch (child.nodeType) {
            case Node.ELEMENT_NODE:
                deepUiText(useTag, excludeElements, child, regex, callback, validate);
                break;
            case Node.TEXT_NODE:
                replaceTextWithNode(child, regex, callback, validate);
                break;
        }
        child = child.nextSibling;
    }
    return node;
}
exports.replaceText = replaceText;
exports.default = replaceText;
//# sourceMappingURL=index.js.map