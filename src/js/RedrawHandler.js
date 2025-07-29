import Validation from "./Validation";

export default class RedrawHandler {
  constructor(widget, dataSistem) {
    this.widget = widget;
    this.paySistem = dataSistem;
    this.input = this.widget.querySelector(".input");
    this.mes = this.widget.querySelector(".mes");
    this.mesText = this.widget.querySelector(".text");
    this.widgetList = this.widget.querySelector(".widget__list");
    this.validator = new Validation(this.paySistem);
    this.form = this.widget.querySelector(".widget__form");
    this.button = this.widget.querySelector(".button");
  }

  toAppoint() {
    this.input.addEventListener("input", () => this.showPaySistem());
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.inputHandler();
    });
  }

  showPaySistem() {
    const sistName = this.input.value.length;
    if (sistName === 2) {
      const name = this.getPaySistem(this.input.value);
      if (name) {
        this.removeMes();
        this.addCheckedTransparent(name);
      } else {
        this.addMes(
          "the payment system was not found",
          "colorInvalid",
          "bgInvalid",
        );
      }
    }
    if (sistName < 2) {
      this.clean();
      this.removeMes();
    }
  }

  inputHandler() {
    const { value } = this.input;
    if (this.getPaySistem(value)) {
      if (
        this.validator.checkNumLength(value) &&
        this.validator.checkLuhnAlgo(value)
      ) {
        const shortName = this.getPaySistem(value);
        const fullName = this.getFullName(shortName);
        if (fullName) {
          this.clean();
          this.removeMes();
          this.addMes(
            `The card is valid, the ${fullName} payment system`,
            "colorValid",
            "bgValid",
          );
          this.addCheckedTransparent(shortName);
        }
      } else {
        this.addMes("The card is not valid", "colorInvalid", "bgInvalid");
        this.clean();
      }
    } else {
      this.addMes(
        "the payment system was not found",
        "colorInvalid",
        "bgInvalid",
      );
    }
  }

  getFullName(shortName, data = this.paySistem) {
    const tmp = Object.values(data);
    const temp = tmp.find((e) => e.name === shortName);
    if (temp) {
      this.fullName = temp.fullName;
      return this.fullName;
    }
    return "";
  }

  addCheckedTransparent(shortName) {
    this.widgetList.querySelector(`.${shortName}`).classList.add("checked");
    this.widgetList.querySelectorAll(".widget__item").forEach((e) => {
      e.classList.add("transparent");
    });
  }

  clean() {
    this.widgetList.querySelectorAll(".widget__item").forEach((e) => {
      e.classList.remove("checked", "transparent");
    });
  }

  getPaySistem(value) {
    const tmp = value.split("");
    const temp = tmp[0] + tmp[1];
    // console.log(tmp, temp);
    if (this.paySistem[tmp[0]] || this.paySistem[temp]) {
      // console.log(this.paySistem[tmp[0]], this.paySistem[temp]);
      // console.log(this.validator.checkPaySystem(tmp[0], this.validator.checkPaySystem(temp)));
      return (
        this.validator.checkPaySystem(tmp[0]) ||
        this.validator.checkPaySystem(temp)
      );
    }
    return false;
  }

  addMes(text, cssClass, bgInput) {
    this.mesText.textContent = text;
    this.mesText.classList.add(cssClass);
    this.mes.classList.remove("d_none");
    this.input.classList.add(bgInput);
  }

  removeMes() {
    this.mesText.textContent = "";
    this.mesText.className = "text";
    this.mes.className = "mes d_none";
    this.input.className = "input";
  }
}
