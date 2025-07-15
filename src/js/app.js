import BankCardWidget from "../components/bank-card-widget/js/bank-card-widget";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementsByTagName("body")[0];
  new BankCardWidget(body);
});
