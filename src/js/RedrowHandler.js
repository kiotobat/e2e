import Validation from './Validation';

/**
 * Класс отвечает за логику перерисовки DOM.
 */
export default class RedrowHandler {
  constructor(widget, dataSistem) {
    this.widget = widget;
    this.paySistem = dataSistem;
    this.input = this.widget.querySelector('.input');
    this.mes = this.widget.querySelector('.mes');
    this.mesText = this.widget.querySelector('.text');
    this.widgetList = this.widget.querySelector('.widget__list');
    this.validator = new Validation(this.paySistem);
    this.form = this.widget.querySelector('.widget__form');
    this.button = this.widget.querySelector('.button');
  }

  /**
   * Подключает обработчиков событий
   */
  toAppoint() {
    this.input.addEventListener('input', () => this.showPaySistem());
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.inputHandler();
    });
  }

  /**
   * Обработчик собыитя input, проверяет input по перым двум символам наличие
   * в памяти платёжной системы, добавляет класс checked эл-ту widget__item и
   * класс transparent всем эл-там widget__item_absolute
   * которые отвечают за увеличение и прозрачность. При отсувствии платёжной системы в
   * памяти, вызывает метод addMes и выводит сообщение.
   */
  showPaySistem() {
    const sistName = this.input.value.length;
    if (sistName === 2) {
      const name = this.getPaySistem(this.input.value);
      if (name) {
        this.removeMes();
        this.addCheckedTransparent(name);
      } else {
        this.addMes('the payment system was not found', 'colorInvalid', 'bgInvalid');
      }
    }
    if (sistName < 2) {
      this.clean();
      this.removeMes();
    }
  }

  /**
   * Обработчик собыитий keyup и click
   * @param {*} event
   */
  inputHandler() {
    const { value } = this.input;
    if (this.getPaySistem(value)) {
      if (this.validator.checkNumLength(value) && this.validator.checkLuhnAlgo(value)) {
        const shortName = this.getPaySistem(value);
        const fullName = this.getFullName(shortName);
        if (fullName) {
          this.clean();
          this.removeMes();
          this.addMes(`The card is valid, the ${fullName} payment system`, 'colorValid', 'bgValid');
          this.addCheckedTransparent(shortName);
        }
      } else {
        this.addMes('The card is not valid', 'colorInvalid', 'bgInvalid');
        this.clean();
      }
    } else {
      this.addMes('the payment system was not found', 'colorInvalid', 'bgInvalid');
    }
  }

  /**
   * Находит полное название платежной системы в объекте paySistem
   * @param {string} shortName значение свойства name объекта paySistem
   * @param {Object} data объект хранящий данные пл. систем
   * @returns string, значение свойства fullName в объекте paySistem
   */
  getFullName(shortName, data = this.paySistem) {
    const tmp = Object.values(data);
    const temp = tmp.find((e) => e.name === shortName);
    if (temp) {
      this.fullName = temp.fullName;
      return this.fullName;
    }
    return '';
  }

  /**
   * добавляет классы checked и transparent элементам карт
   * @param {string} shortName название платежной системы
   */
  addCheckedTransparent(shortName) {
    this.widgetList.querySelector(`.${shortName}`).classList.add('checked');
    this.widgetList.querySelectorAll('.widget__item').forEach((e) => {
      e.classList.add('transparent');
    });
  }

  /**
   * Удаляет классы checked и transparent у элементов карт
   */
  clean() {
    this.widgetList.querySelectorAll('.widget__item').forEach((e) => {
      e.classList.remove('checked', 'transparent');
    });
  }

  /**
   * @param {string} value
   * @returns false || название платежной системы.
   */
  getPaySistem(value) {
    const tmp = value.split('');
    const temp = tmp[0] + tmp[1];
    // console.log(tmp, temp);
    if (this.paySistem[tmp[0]] || this.paySistem[temp]) {
      // console.log(this.paySistem[tmp[0]], this.paySistem[temp]);
      // console.log(this.validator.checkPaySystem(tmp[0], this.validator.checkPaySystem(temp)));
      return this.validator.checkPaySystem(tmp[0]) || this.validator.checkPaySystem(temp);
    }
    return false;
  }

  /**
   * Выводит сообщение
   * @param {string} text текст сообщения
   * @param {string} cssClass css-класс, цвет текста сообщения
   * @param {string} bgInput css-класс, фон блока input.
   */
  addMes(text, cssClass, bgInput) {
    this.mesText.textContent = text;
    this.mesText.classList.add(cssClass);
    this.mes.classList.remove('d_none');
    this.input.classList.add(bgInput);
  }

  /**
   * Удаляет сообщение
   */
  removeMes() {
    this.mesText.textContent = '';
    this.mesText.className = 'text';
    this.mes.className = 'mes d_none';
    this.input.className = 'input';
  }
}
