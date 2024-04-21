import { Component } from "../../core/Component";
import template from "./create-expense-form.template.hbs";

export class CreateProfitForm extends Component {
    constructor() {
        super();

        this.state = {};
        this.template = template();
    }
}

customElements.define('ui-create-expense-form', CreateProfitForm);