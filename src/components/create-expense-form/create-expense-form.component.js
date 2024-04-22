import { Component } from "../../core/Component";
import template from "./create-expense-form.template.hbs";

export class CreateProfitForm extends Component {
    constructor() {
        super();

        this.state = {
            categories: "",
            sum: null,
            date: null,
            description: "",
        };
        this.template = template();
    }

    initForm() {
        this.setState({
          ...this.state,
          categories: this.getAttribute("categories"),
          sum: this.getAttribute("sum"),
          date: this.getAttribute("date"),
          description: this.getAttribute("description"),
        });
      }

      componentDidMount() {
        this.initForm();
      }
    
      componentWillUnmount() {
      }
}

customElements.define('ui-create-expense-form', CreateProfitForm);