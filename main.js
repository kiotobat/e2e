/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/components/card-validator-widget/luhnValidationOfCard.js
/* eslint no-cond-assign: "off" */

function luhnValidationOfCard(cardNumber) {
  const thereAreNoNumbers = /\D/.test(cardNumber);
  if (typeof cardNumber !== 'string' || thereAreNoNumbers || cardNumber.length === 0) {
    throw new Error('The `cardNumber` parameter must be a string containing the card number');
  }
  let length = cardNumber.length;
  let isEven = false;
  let checksum = 0;
  while (length > 0) {
    length--;
    checksum += '01234567890246813579'.charAt(cardNumber.charAt(length) * 1 + ((isEven = !isEven) ? 0 : 10)) * 1;
  }
  return checksum % 10 == 0; // https://stackoverflow.com/a/25641431
}
;// ./src/components/card-validator-widget/definitionOfPaymentSystem.js
function definitionOfPaymentSystem(cardNumber) {
  const thereAreNoNumbers = /\D/.test(cardNumber);
  if (typeof cardNumber !== 'string' || thereAreNoNumbers || cardNumber.length === 0) {
    throw new Error('The `cardNumber` parameter must be a string containing the card number');
  }
  const mirRegexp = new RegExp('^220[0-4][0-9]{12,15}$');
  const visaRegexp = new RegExp('^4[0-9]{12}(?:[0-9]{0}|[0-9]{3}|[0-9]{6})$');
  const mastercardRegexp = new RegExp('^5[1-5][0-9]{14}|222[1-9][0-9]{12}|22[3-9][0-9]{13}|2[3-6][0-9]{14}|27[01][0-9]{13}|2720[0-9]{12}$');
  const americanExpressRegexp = new RegExp('^3[47][0-9]{13}$');
  const discoverRegexp = new RegExp('^6(?:011|5[0-9]{2})(?:[0-9]{12}|[0-9]{15})$');
  const jcbRegexp = new RegExp('^(?:2131|1800|35[0-9]{2})[0-9]{12,15}$');
  const dinersClubRegexp = new RegExp('^3(?:0[0-5]|[68][0-9])[0-9]{11}$');
  const clearedCardNumber = cardNumber.replace(/\D/g, '');
  let paymentSystem = 'unknown';
  if (clearedCardNumber.match(mirRegexp)) {
    paymentSystem = 'mir';
  } else if (clearedCardNumber.match(visaRegexp)) {
    paymentSystem = 'visa';
  } else if (clearedCardNumber.match(mastercardRegexp)) {
    paymentSystem = 'mastercard';
  } else if (clearedCardNumber.match(americanExpressRegexp)) {
    paymentSystem = 'american-express';
  } else if (clearedCardNumber.match(discoverRegexp)) {
    paymentSystem = 'discover';
  } else if (clearedCardNumber.match(jcbRegexp)) {
    paymentSystem = 'jcb';
  } else if (clearedCardNumber.match(dinersClubRegexp)) {
    paymentSystem = 'diners-club';
  }
  return paymentSystem;
}
;// ./src/components/card-validator-widget/CardWidget.js


class CardWidget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
  }
  static get markup() {
    return `
      <form class="card-validator-form">
        <h2>Проверка номера карты</h2>
        <ul class="payment-systems">
          <li class="payment-system-img mir" title="МИР"></li>
          <li class="payment-system-img visa" title="Visa"></li>
          <li class="payment-system-img mastercard" title="Mastercard"></li>
          <li class="payment-system-img american-express" title="American Express"></li>
          <li class="payment-system-img discover" title="Discover"></li>
          <li class="payment-system-img jcb" title="JCB"></li>
          <li class="payment-system-img diners-club" title="Diners Club"></li>
        </ul>
        <div class="card-validator-control">
          <input class="card-validator-input" type="text" minlength="12" maxlength="20" placeholder="Введите номер карты...">
          <button class="card-validator-submit">Нажмите для проверки</button>
        </div>
        <div class="card-validator-message"></div>
      </form>
    `;
  }
  static get selector() {
    return '.card-validator-form';
  }
  static get inputSelector() {
    return '.card-validator-input';
  }
  static get submitSelector() {
    return '.card-validator-submit';
  }
  static get messageSelector() {
    return '.card-validator-message';
  }
  static get paymentSystemImageSelector() {
    return '.payment-system-img';
  }
  bindToDOM() {
    this.parentEl.insertAdjacentHTML('beforeEnd', CardWidget.markup);
    this.element = this.parentEl.querySelector(CardWidget.selector);
    this.input = this.element.querySelector(CardWidget.inputSelector);
    this.submit = this.element.querySelector(CardWidget.submitSelector);
    this.message = this.element.querySelector(CardWidget.messageSelector);
    this.paymentSystemImages = [...this.element.querySelectorAll(CardWidget.paymentSystemImageSelector)];
    this.element.addEventListener('submit', this.onSubmit);
    this.input.addEventListener('input', this.onInput);
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.input.value.length > 0) {
      this.message.textContent = '';
      this.message.classList.add('warning');
      this.paymentSystemImages.forEach(image => image.classList.add('not-suitable'));
      this.validationAndDefinition();
    }
  }
  onInput() {
    this.message.textContent = '';
    this.message.className = 'card-validator-message';
    this.paymentSystemImages.forEach(image => image.classList.remove('not-suitable'));
  }
  validationAndDefinition() {
    const cardNumber = this.input.value.replace(/\s/g, '');
    const thereAreNoNumbers = /\D/.test(cardNumber);
    if (thereAreNoNumbers) {
      this.message.insertAdjacentHTML('beforeEnd', 'Пожалуйста, вводите только цифры!');
      return;
    }
    const isValid = luhnValidationOfCard(cardNumber);
    if (!isValid) {
      this.message.insertAdjacentHTML('beforeEnd', `Номер карты ${cardNumber} не прошёл проверку!`);
      return;
    }
    const paymentSystem = definitionOfPaymentSystem(cardNumber);
    this.message.className = 'card-validator-message success';
    if (paymentSystem === 'unknown') {
      this.message.insertAdjacentHTML('beforeEnd', `Номер карты ${cardNumber} прошёл проверку! Платёжная система не определена`);
      return;
    }
    const paymentSystemImage = this.paymentSystemImages.find(image => image.classList.contains(paymentSystem));
    paymentSystemImage.classList.remove('not-suitable');
    this.message.insertAdjacentHTML('beforeEnd', `Номер карты ${cardNumber} прошёл проверку! Платёжная система — <strong>${paymentSystemImage.title}</strong>`);
  }
}
;// ./src/js/app.js
// TODO: write code here


document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.content');
  const cardWidget = new CardWidget(container);
  cardWidget.bindToDOM();
});
;// ./src/index.js




// TODO: write your code in app.js
/******/ })()
;