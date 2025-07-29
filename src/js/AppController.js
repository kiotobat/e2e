import WidgetStartPage from "./WidgetStartPage";
import RedrawHandler from "./RedrawHandler";
import paySistem from "./paySistem";

export default class AppController {
  init(container) {
    this.widget = new WidgetStartPage();
    this.widget.bindToDOM(container);
    this.widget.drawUI();
    this.handler = new RedrawHandler(this.widget.container, paySistem);
    this.handler.toAppoint();
  }
}
