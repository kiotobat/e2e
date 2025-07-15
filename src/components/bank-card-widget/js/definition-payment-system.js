// Функция, определяющая платежную систему
export default function definitionPaymentSystem(input) {
  const numberAsText = input.toString().replace(/\D/g, "");
  for (let i of payments) {
    if (
      i.pattern.test(numberAsText) &&
      i.length.includes(numberAsText.length)
    ) {
      return i.name;
    }
  }
  return "unknown";
}

// Функция-генератор, позволяет задавать интервал чисел
function* makeRangeIterator(start, end, step = 1) {
  let iterationCount = 0;
  for (let i = start; i <= end; i += step) {
    iterationCount++;
    yield i;
  }
  return iterationCount;
}

// Массив с платежными системами
const payments = [
  {
    name: "mir",
    pattern: /^220[0-4]\d*$/,
    length: [...makeRangeIterator(16, 19)],
  },
  {
    name: "visa",
    pattern: /^4\d*$/,
    length: [13, 16, 19],
  },
  {
    name: "maestro",
    pattern: /^(5018|5020|5038|5893|6304|6759|676[1-3])\d*$/,
    length: [...makeRangeIterator(12, 19)],
  },
  {
    name: "mastercard",
    pattern: /^(5[1-5]|2[3-6]|27[01]|2720|22[3-9]|222[1-9])\d*$/,
    length: [16],
  },
  {
    name: "unionpay",
    pattern: /^62\d*$/,
    length: [...makeRangeIterator(16, 19)],
  },
  {
    name: "jsb",
    pattern: /^(35[3-8]|352[89])\d*$/,
    length: [...makeRangeIterator(16, 19)],
  },
  {
    name: "discover",
    pattern:
      /^(65|6011|64[4-9]|622[2-8]|6229[01]|62292[0-5]|6221[3-9])|62212[6-9]\d*$/,
    length: [...makeRangeIterator(16, 19)],
  },
  {
    name: "dinersClub",
    pattern: /^(36|54|55|30[0-5])\d*$/,
    length: [14, 16],
  },
  {
    name: "americanExpress",
    pattern: /^(34|37)\d*$/,
    length: [15],
  },
];
