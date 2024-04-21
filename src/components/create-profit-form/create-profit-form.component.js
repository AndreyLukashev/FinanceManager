import { Component } from "../../core/Component";
import template from "./create-profit-form.template.hbs";

export class CreateProfitForm extends Component {
    constructor() {
        super();

        this.state = {};
        this.template = template();
    }
}

customElements.define('ui-create-profit-form', CreateProfitForm);