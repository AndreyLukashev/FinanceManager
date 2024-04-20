import { Component } from "../../core/Component";
import template from "./create-expense-form.template.hbs";

export class CreateProfitForm extends Component {
    constructor() {
        super();

        this.state = {};
        this.template = template();
    }

    
//       componentDidMount() {
//         // this.initForm();
//         // this.addEventListener("change", this.validator);
//       }
    
//       componentWillUnmount() {
//         // this.removeEventListener("change", this.validator);
//       }
    
}

customElements.define('ui-create-expense-form', CreateProfitForm);