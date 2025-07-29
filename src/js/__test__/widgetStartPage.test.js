import WidgetStartPage from '../WidgetStartPage';

describe('Проверка отрисовки стартовой страницы', () => {
  const widget = new WidgetStartPage();
  document.body.innerHTML = '<div class="validator"></div>';
  widget.bindToDOM(document.querySelector('.validator'));
  widget.drawUI();

  test('Test 1', () => {
    expect(widget.container.innerHTML).toEqual(WidgetStartPage.markup);
  });

  test('Test 2', () => {
    expect(document.querySelector('.validator').children[0].className).toBe('validator__body');
    expect(document.querySelector('.validator').children[0].children[0].className).toBe('validator__content');
    expect(document.querySelector('.validator__content').children[0].className).toBe('validator__tittle');
    expect(document.querySelector('.validator__content').children[1].className).toBe('validator__widget widget');
    expect(document.querySelector('.validator__widget').children[0].className).toBe('widget__list');
    expect(document.querySelector('.validator__widget').children[1].className).toBe('widget__form');
    expect(document.querySelector('.widget__list').children[1].className).toBe('widget__item_absolute');
    expect(document.forms[0].elements.length).toBe(2);
  });

  test('Test 3', () => {
    widget.container = null;
    expect(() => widget.checkBinding()).toThrowError(new Error('Widget is not bind to DOM'));
  });
});
