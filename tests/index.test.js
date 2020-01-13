const { EncapsulationElement, replaceElement } = require('../dist/index');


const regex = /Lucas/;

test('replace content', () => {
    document.body.innerHTML = '<div>Olá, meu nome é Lucas</div>';
    replaceElement(regex, (payload, element) => {
        expect(payload).toMatch(regex);
        expect(element).toBeInstanceOf(HTMLElement);
    });
    expect(document.getElementsByTagName(EncapsulationElement).length).toBe(1);
    expect(document.getElementsByTagName(EncapsulationElement)[0].innerText).toBe('Lucas');
});