/**
 * Класс отвечающий за валидацию переданных значений, не привязан к DOM.
 */
export default class Validation {
  constructor(paySistem) {
    this.regex1 = new RegExp('^[0-9]{14}$');
    this.regex2 = new RegExp('^[0-9]{15}$');
    this.regex3 = new RegExp('^[0-9]{16}$');
    this.paySistem = paySistem;
  }

  /**
   * Проверяет переданную строку на соответствие шаблонам (14, 15 или 16 цифр)
   * @param {string} value
   * @returns boolean
   */
  checkNumLength(value) {
    return this.regex1.test(value) || this.regex2.test(value) || this.regex3.test(value);
  }

  /**
   * Проверка по алгоритму Луна
   * @param {string} value
   * @returns boolean
   */
  checkLuhnAlgo(value) {
    let sum = 0;
    let even = false;
    if (value && +value) {
      this.temp = String(value).replace(/[^\d]/g, '');
      for (let i = this.temp.length - 1; i >= 0; i -= 1) {
        let int = parseInt(this.temp.charAt(i), 10);
        if (even) {
          int *= 2;
          if (int > 9) {
            int -= 9;
          }
        }
        sum += int;
        even = !even;
      }
      return (sum % 10) === 0;
    }
    return false;
  }

  /**
   * Проверяет переданное значение на наличие в объекте paySistem ключа с таким значением
   * @param {string || number} value
   * @returns false || или значение свойства name в объекте paySistem
   */
  checkPaySystem(value) {
    if (value) {
      this.value = String(value).trim();
      if (this.paySistem[this.value] && this.value.startsWith(this.paySistem[this.value].starts)) {
        return this.paySistem[this.value].name;
      }
    }
    return false;
  }
}
