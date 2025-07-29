import RedrowHandler from '../RedrowHandler';
import paySistem from '../paySistem';
import WidgetStartPage from '../WidgetStartPage';

document.body.innerHTML = '<div class="validator"></div>';
const widget = new WidgetStartPage();
widget.bindToDOM(document.querySelector('.validator'));
widget.drawUI();
const handler = new RedrowHandler(widget.container, paySistem);

test('Метод addMes должен сгенерировать сообщение по переданным параметрам', () => {
  handler.addMes('Тестовое сообщение', 'colorValid', 'bgValid');
  expect(handler.mesText.textContent).toBe('Тестовое сообщение');
  expect(handler.mesText.className).toBe('text colorValid');
  expect(handler.mes.className).toBe('mes');
  expect(handler.input.className).toBe('input bgValid');
});

test('Метод removeMes должен удалить сообщение', () => {
  handler.removeMes();
  expect(handler.mesText.textContent).toBe('');
  expect(handler.mesText.className).toBe('text');
  expect(handler.mes.className).toBe('mes d_none');
  expect(handler.input.className).toBe('input');
});

test('Метод addCheckedTransparent добавляет классы checked и transparent', () => {
  handler.addCheckedTransparent('visa');
  expect(document.querySelector('.visa').className).toBe('widget__item visa checked transparent');
  expect(document.querySelector('.mastercard').className).toBe('widget__item mastercard transparent');
  expect(document.querySelector('.mir').className).toBe('widget__item mir transparent');
  expect(document.querySelector('.diners').className).toBe('widget__item diners transparent');
});

test('Метод clean удаляет классы checked и transparent', () => {
  handler.clean();
  expect(document.querySelector('.visa').className).toBe('widget__item visa');
  expect(document.querySelector('.mastercard').className).toBe('widget__item mastercard');
  expect(document.querySelector('.mir').className).toBe('widget__item mir');
  expect(document.querySelector('.diners').className).toBe('widget__item diners');
});

describe('Метод getPaySistem должет вернут название пл. системы или false', () => {
  test.each([
    ['Test 1', '5185016421053184', 'mastercard'],
    ['Test 2', '3541529934286103', 'jcb'],
    ['Test 3', '36865410416253', 'diners'],
    ['Test 4', '372860196586850', 'amex'],
    ['Test 5', '4716983987165598', 'visa'],
    ['Test 6', '6011815754814932', 'discover'],
    ['Test 7', '2211815754814932', 'mir'],
    ['Test 8', '1111111111111111', false],
    ['Test 9', '0000000000000000', false],
    ['Test 10', '', false],
  ])(('%s передали %s должен вернуть %s'), (_, input, value) => {
    expect(handler.getPaySistem(input)).toBe(value);
  });
});

describe('Метод getFullName должен вернуть значение свойства fullName объекта paySistem', () => {
  test.each([
    ['Test 1', 'visa', 'Visa'],
    ['Test 2', 'mastercard', 'MasterCard'],
    ['Test 2', 'diners', 'Dinners Club'],
    ['Test 2', 'discover', 'Discover'],
    ['Test 2', 'amex', 'American Express'],
    ['Test 2', 'jcb', 'JCB'],
    ['Test 2', 'mir', 'МИР'],
  ])(('%s передали %s должен вернуть %s'), (_, input, value) => {
    expect(handler.getFullName(input)).toBe(value);
  });
});

test('Метод showPaySistem должен вызывать методы removeMes и addCheckedTransparent', () => {
  handler.input.value = '22';
  handler.removeMes = jest.fn();
  handler.addCheckedTransparent = jest.fn();
  handler.getPaySistem = jest.fn();
  handler.getPaySistem.mockReturnValue(true);
  handler.showPaySistem();
  expect(handler.removeMes).toHaveBeenCalled();
  expect(handler.addCheckedTransparent).toHaveBeenCalled();
});

test('Метод showPaySistem не должен вызывать методы removeMes и addCheckedTransparent', () => {
  handler.input.value = '22';
  handler.removeMes = jest.fn();
  handler.addCheckedTransparent = jest.fn();
  handler.getPaySistem = jest.fn();
  handler.getPaySistem.mockReturnValue(false);
  handler.showPaySistem();
  expect(handler.removeMes).not.toBeCalled();
  expect(handler.addCheckedTransparent).not.toBeCalled();
});

test('Метод showPaySistem должен вызывать метод addMes', () => {
  handler.input.value = '11';
  handler.addMes = jest.fn();
  handler.showPaySistem();
  expect(handler.addMes).toBeCalled();
});

test('Метод showPaySistem должен вызывать методы clean и removeMes', () => {
  handler.input.value = '2';
  handler.clean = jest.fn();
  handler.removeMes = jest.fn();
  handler.showPaySistem();
  expect(handler.clean).toBeCalled();
  expect(handler.removeMes).toBeCalled();
});

describe('Проверка подключения обработчиков собыитий', () => {
  const eventInput = new KeyboardEvent('input');
  // const eventKeyup = new KeyboardEvent('keyup', { code: 'Enter' });
  const eventClick = new MouseEvent('click');
  const eventSubmit = new Event('submit');

  handler.toAppoint();

  test('При событии input должен вызваться метод showPaySistem', () => {
    handler.showPaySistem = jest.fn();
    handler.input.dispatchEvent(eventInput);
    expect(handler.showPaySistem).toBeCalled();
  });

  test('При клике на кнопку должен вызваться метод inputHandler', () => {
    handler.inputHandler = jest.fn();
    handler.button.dispatchEvent(eventClick);
    expect(handler.inputHandler).toBeCalled();
  });

  test('При событии submit должны вызываться event.preventDefault и inputHandler', () => {
    eventSubmit.preventDefault = jest.fn();
    handler.inputHandler = jest.fn();
    handler.form.dispatchEvent(eventSubmit);
    expect(eventSubmit.preventDefault).toBeCalled();
    expect(handler.inputHandler).toBeCalled();
  });
});
