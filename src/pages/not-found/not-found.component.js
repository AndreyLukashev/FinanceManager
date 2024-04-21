import { ROUTES } from "../../constants/routes";
import { Component } from "../../core/Component";
import { useNavigate } from "../../hooks/useNavigate";
import template from "./not-found.template.hbs";

export class NotFound extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {};
  }

  onClick = ({target}) => {
    const homePage = target.closest('.home-page');
  
    if(homePage){
      useNavigate(`${ROUTES.home}`);
    }

  }

  componentDidMount() {
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener('clik', this.onClick)
  }
}

customElements.define("not-found", NotFound);