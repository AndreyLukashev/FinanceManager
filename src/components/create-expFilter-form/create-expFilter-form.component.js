import { Component } from "../../core/Component";
import template from "./create-expFilter-form.template.hbs";

export class CreateExpFilterForm extends Component {
    constructor() {
        super();

        this.state = {
            categories: "",
            startdate: null,
            enddate: null,
        };
        this.template = template();
    }

    initForm() {
        this.setState({
          ...this.state,
          categories: this.getAttribute("categories"),
          startdate: this.getAttribute("startdate"),
          enddate: this.getAttribute("enddate"),
        });
      }

      componentDidMount() {
        this.initForm();
      }
    
      componentWillUnmount() {
      }
}

customElements.define('ui-create-expfilter-form', CreateExpFilterForm);