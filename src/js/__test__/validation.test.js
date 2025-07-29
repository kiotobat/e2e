import paySistem from '../paySistem';
import Validation from '../Validation';

const validator = new Validation(paySistem);

describe('Метод checkNumLength должен сравнивать переданную строку с шаблонами корректно', () => {
  test.each([
    ['Тест 1 false', '1111111111111', false],
    ['Тест 2 true', '11111111111111', true],
    ['Тест 3 true', '111111111111111', true],
    ['Тест 4 true', '1111111111111111', true],
    ['Тест 5 false', '11111111111111111', false],
  ])(('Должен быть %s'), (_, input, expected) => {
    expect(validator.checkNumLength(input)).toBe(expected);
  });
});

describe('Метод checkLuhnAlgo должен проверять переданное значение по алгоритму Луна корректно', () => {
  test.each([
    ['Тест 1', '4716983987165598', true],
    ['Тест 2', '4225414378713780418', true],
    ['Тест 3', '36865410416253', true],
    ['Тест 4', 6762976812058473, true],
    ['Тест 5', '2222222222222222222', false],
    ['Тест 6', '', false],
    ['Тест 7', '0000000000000000', false],
    ['Тест 8', '0', false],
    ['Тест 9', NaN, false],
  ])(('Должен быть %s'), (_, input, expected) => {
    expect(validator.checkLuhnAlgo(input)).toBe(expected);
  });
});

describe('checkPaySystem проверяет переданное значение на наличие в объекте paySistem ключа с таким значением', () => {
  test.each([
    ['Test 1', 37, 'amex'],
    ['Test 2', 30, 'diners'],
    ['Test 3', 60, 'discover'],
    ['Test 4', 35, 'jcb'],
    ['Test 5', 51, 'mastercard'],
    ['Test 6', 2, 'mir'],
    ['Test 7', 4, 'visa'],
  ])(('Если в %s передаём %d должен вернуть %s'), (_, input, expected) => {
    expect(validator.checkPaySystem(input)).toBe(expected);
  });
});
