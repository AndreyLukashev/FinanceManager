import { Component } from "../../core/Component";
import template from "./work.template.hbs";

export class WorkPage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {};
  }
}

customElements.define("work-page", WorkPage);