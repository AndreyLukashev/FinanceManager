import { Component } from "../../core/Component";
import template from "./expense.template.hbs";

export class ExpensePage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {};
  }
}

customElements.define("expense-page", ExpensePage);