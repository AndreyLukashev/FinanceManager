import { Component } from "../../core/Component";
import template from "./create-profFilter-form.template.hbs";

export class CreateProfFilterForm extends Component {
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

customElements.define('ui-create-proffilter-form', CreateProfFilterForm);