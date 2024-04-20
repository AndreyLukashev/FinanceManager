import { Component } from "../../core/Component";
import template from "./profit.template.hbs";

export class ProfitPage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {};
  }
}

customElements.define("profit-page", ProfitPage);