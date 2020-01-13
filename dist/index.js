"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncapsulationElement = "x-replace-ui";
function tagDeepening(useTag, excludeElements, child, regex, callback, validate) {
    if (useTag === void 0) { useTag = exports.EncapsulationElement; }
    if (excludeElements.indexOf(child.tagName.toLowerCase()) !== -1) {
        return;
    }
    replaceElement(regex, callback, validate, child, useTag, excludeElements);
}
function replaceTextElement(textChild, regex, callback, validate) {
    var match;
    while (true) {
        match = regex.exec(textChild.data);
        if (match === null) {
            break;
        }
        if (textChild.parentElement === null) {
            continue;
        }
        var payload = match[0];
        if (typeof validate !== "undefined" && !validate(payload, textChild, match)) {
            return;
        }
        var messageBegin = textChild.data.substr(0, match.index);
        var messageEnd = textChild.data.substr(match.index + payload.length);
        var newElement = document.createElement(exports.EncapsulationElement);
        /* message begin */
        textChild.data = messageBegin;
        /* payload */
        textChild.parentElement.append(newElement);
        textChild.parentElement.append(new Text(messageEnd));
        var callbackNode = callback(payload, newElement);
        if (callbackNode) {
            newElement.append(callbackNode);
        }
        else {
            newElement.innerText = payload;
        }
    }
    regex.lastIndex = 0;
    return textChild;
}
function replaceElement(regex, callback, validate, node, useTag, excludeElements) {
    if (node === void 0) { node = document.body; }
    if (useTag === void 0) { useTag = exports.EncapsulationElement; }
    if (excludeElements === void 0) { excludeElements = [
        "script",
        "style",
        "iframe",
        "canvas",
        "button",
        "textarea",
        useTag,
    ]; }
    var child = node.firstChild;
    while (child) {
        switch (child.nodeType) {
            case Node.ELEMENT_NODE:
                tagDeepening(useTag, excludeElements, child, regex, callback, validate);
                break;
            case Node.TEXT_NODE:
                replaceTextElement(child, regex, callback, validate);
                break;
        }
        child = child.nextSibling;
    }
    return node;
}
exports.replaceElement = replaceElement;
exports.default = replaceElement;
//# sourceMappingURL=index.js.map