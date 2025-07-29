import "../css/bank-card-widget.css";
import * as cardSrc from "./logo-cards";
import luhnCheck from "./luhn-check";
import definitionPaymentSystem from "./definition-payment-system";

// Класс для создания виджета и взаимодействия с DOM
export default class BankCardWidget {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.createWidget();
  }

  // Метод, добавляющий виджет в DOM
  createWidget() {
    const divWidget = document.createElement("div");
    this.parentElement.append(divWidget);
    divWidget.classList.add("bank-card-widget");

    this.divCards = document.createElement("div");
    divWidget.append(this.divCards);
    this.divCards.classList.add("cards");
    let htmlText = "";
    for (let src in cardSrc) {
      htmlText += `<img src="${cardSrc[src]}" alt = "${src}" class = "card ${src}">`;
    }
    this.divCards.innerHTML = htmlText;
    const divForm = document.createElement("div");
    htmlText = `
    <form class="bank-card-widget-form">
      <input type="text" placeholder="Введите номер банковской карты" class="bank-card-widget-input" required>
      <button type="submit" class="bank-card-widget-button">Click to Validate</button>
    </form>`;
    divForm.innerHTML = htmlText;
    divWidget.append(divForm);
    this.input = document.querySelector(".bank-card-widget-input");
    this.cardNumberValidation = this.cardNumberValidation.bind(this);
    divForm.addEventListener("submit", this.cardNumberValidation);
    this.removesSelection = this.removesSelection.bind(this);
    divForm.addEventListener("input", this.removesSelection);
  }

  // Метод, определяющий взаимодействие с DOM
  cardNumberValidation(e) {
    e.preventDefault();
    const valid = luhnCheck(this.input.value);
    if (!valid) {
      this.input.classList.add("invalid");
      return;
    }
    this.input.classList.add("valid");
    const payment = definitionPaymentSystem(this.input.value);
    const activCard = this.divCards.querySelector(`.${payment}`);
    activCard.classList.add("active");
  }

  removesSelection() {
    if (this.divCards.querySelector(".active")) {
      const activCard = this.divCards.querySelector(".active");
      activCard.classList.remove("active");
    }
    if (this.input.classList.contains("valid")) {
      this.input.classList.remove("valid");
    }
    if (this.input.classList.contains("invalid")) {
      this.input.classList.remove("invalid");
    }
  }
}
