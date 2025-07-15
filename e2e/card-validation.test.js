import puppeteer from "puppeteer";

jest.setTimeout(30000); // default puppeteer timeout

describe("E2E tests", () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });
    page = await browser.newPage();
  });

  // eslint-disable-next-line jest/expect-expect
  test.each([
    ["4916246600576478", "valid"],
    ["sdrgag", "invalid"],
  ])(
    "Проверка изменения цвета строки ввода при номере карты %p",
    async (inputNumber, status) => {
      await page.goto("http://localhost:9000");

      await page.waitForSelector(".bank-card-widget-form");

      const input = await page.$(".bank-card-widget-input");
      const button = await page.$(".bank-card-widget-button");

      await input.type(inputNumber);
      await button.click();

      await page.waitForSelector(`.bank-card-widget-input.${status}`);
    },
  );

  afterEach(async () => {
    await browser.close();
  });
});
