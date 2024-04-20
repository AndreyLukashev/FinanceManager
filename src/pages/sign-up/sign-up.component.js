import { Component } from "../../core/Component";
import template from "./sign-up.template.hbs";

export class SignUp extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {};
  }
}

customElements.define("sign-up-page", SignUp);