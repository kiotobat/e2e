import AppController from '../AppController';
import RedrowHandler from '../RedrowHandler';
import WidgetStartPage from '../WidgetStartPage';

document.body.innerHTML = '<div class="validator"></div>';
const appController = new AppController();

test('Инстанс класса должен содержать корректные свойства', () => {
  appController.init(document.querySelector('.validator'));
  expect(appController.widget).toBeInstanceOf(WidgetStartPage);
  expect(appController.handler).toBeInstanceOf(RedrowHandler);
});
