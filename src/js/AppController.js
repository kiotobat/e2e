import WidgetStartPage from './WidgetStartPage';
import RedrowHandler from './RedrowHandler';
import paySistem from './paySistem';

export default class AppController {
  init(container) {
    this.widget = new WidgetStartPage();
    this.widget.bindToDOM(container);
    this.widget.drawUI();
    this.handler = new RedrowHandler(this.widget.container, paySistem);
    this.handler.toAppoint();
  }
}