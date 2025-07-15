import definitionPaymentSystem from "../definition-payment-system";

describe("Тест определения платежной системы", () => {
  test.each([
    [4916246600576478, "visa"],
    [6375725211433079, "unknown"],
    [6216546461651613, "unionpay"],
    [2201382000000021, "mir"],
    [5418336669514419, "mastercard"],
    [5020381678814186, "maestro"],
    [3529571376879702, "jsb"],
    [6011819872058620, "discover"],
    [36394833257913, "dinersClub"],
    [372655196861232, "americanExpress"],
  ])("%# При номере %p %p", (input, expected) => {
    const result = definitionPaymentSystem(input);
    expect(result).toBe(expected);
  });
});
