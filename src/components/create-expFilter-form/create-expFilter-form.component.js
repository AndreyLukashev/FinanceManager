import { Component } from "../../core/Component";
import template from "./create-expFilter-form.template.hbs";

export class CreateExpFilterForm extends Component {
    constructor() {
        super();

        this.state = {
            categories: "",
            sum: null,
            startdate: null,
            endtdate: null,
            description: "",
        };
        this.template = template();
    }

    initForm() {
        this.setState({
          ...this.state,
          categories: this.getAttribute("categories"),
        //   sum: this.getAttribute("sum"),
          startdate: this.getAttribute("startdate"),
          enddate: this.getAttribute("enddate"),

        //   description: this.getAttribute("description"),
        //   expenseBalance: this.getAttribute("sum")
        });
      }

      componentDidMount() {
        this.initForm();
      }
    
      componentWillUnmount() {
      }
}

customElements.define('ui-create-expfilter-form', CreateExpFilterForm);