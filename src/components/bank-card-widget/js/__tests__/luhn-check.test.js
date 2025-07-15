import luhnCheck from "../luhn-check";

describe("Тест проверки валидности номера карты", () => {
  test.each([
    [4916246600576478, true],
    [4916246600576479, false],
    [0, false],
    ["sdrgag", false],
  ])("При номере %p", (input, expected) => {
    const result = luhnCheck(input);
    expect(result).toBe(expected);
  });
});
