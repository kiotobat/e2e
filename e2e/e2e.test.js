import { test, describe, expect, beforeAll, afterAll } from '@jest/globals';
import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);

describe('Testing the card validator widget', () => {
  const baseUrl = 'http://localhost:8087';
  let browser = null;
  let page = null;
  let server = null;

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      if (server.connected) {
        process.send('ok');
        resolve();
      } else {
        reject();
      }
    });

    browser = await puppetteer.launch(
      // {
      //   headless: false,
      //   slowMo: 100,
      //   devtools: true,
      //   defaultViewport: { width: 1000, height: 1000 },
      // }
    );

    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('Something other than numbers was entered into the input field', async () => {
    await page.goto(baseUrl);
    const form = await page.$('.card-validator-form');
    const input = await form.$('.card-validator-input');
    const submit = await form.$('.card-validator-submit');
    await input.type('one1two2three3');
    await submit.click();
    expect(await form.waitForSelector('.card-validator-message.warning')).toBeTruthy();

    const message = await form.$eval('.card-validator-message.warning', elem => elem.textContent);
    expect(message).toBe('Пожалуйста, вводите только цифры!');
  });

  test('An invalid card number was entered into the input field', async () => {
    await page.goto(baseUrl);
    const form = await page.$('.card-validator-form');
    const input = await form.$('.card-validator-input');
    const submit = await form.$('.card-validator-submit');
    await input.type('1651082209953624');
    await submit.click();
    expect(await form.waitForSelector('.card-validator-message.warning')).toBeTruthy();

    const message = await form.$eval('.card-validator-message.warning', elem => elem.textContent);
    expect(message).toBe('Номер карты 1651082209953624 не прошёл проверку!');
  });

  test('An valid card number with an unknown payment system was entered into the input field', async () => {
    await page.goto(baseUrl);
    const form = await page.$('.card-validator-form');
    const input = await form.$('.card-validator-input');
    const submit = await form.$('.card-validator-submit');
    await input.type('6375693142659180');
    await submit.click();
    expect(await form.waitForSelector('.card-validator-message.success')).toBeTruthy();

    const message = await form.$eval('.card-validator-message.success', elem => elem.textContent);
    expect(message).toBe('Номер карты 6375693142659180 прошёл проверку! Платёжная система не определена');
  });

  test('An valid card number with a known payment system was entered into the input field', async () => {
    await page.goto(baseUrl);
    const form = await page.$('.card-validator-form');
    const input = await form.$('.card-validator-input');
    const submit = await form.$('.card-validator-submit');
    await input.type('5527895170344903');
    await submit.click();
    expect(await form.waitForSelector('.card-validator-message.success')).toBeTruthy();
    expect(await form.$('.payment-system-img.mastercard.not-suitable')).toBeNull();

    const paymentSystem = await form.$eval('.payment-system-img.mastercard', elem => elem.title);
    const message = await form.$eval('.card-validator-message.success', elem => elem.textContent);
    expect(message).toBe(`Номер карты 5527895170344903 прошёл проверку! Платёжная система — ${paymentSystem}`);
  });

  test('An valid card number with spaces was entered into the input field', async () => {
    await page.goto(baseUrl);
    const form = await page.$('.card-validator-form');
    const input = await form.$('.card-validator-input');
    const submit = await form.$('.card-validator-submit');
    await input.type('3784 9346 6045 615');
    await submit.click();
    const message = await form.$eval('.card-validator-message.success', elem => elem.textContent);
    expect(message).toBe('Номер карты 378493466045615 прошёл проверку! Платёжная система — American Express');
  });
});