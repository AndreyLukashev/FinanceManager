import { Component } from "../../core/Component";
import template from "./modal.template.hbs";
import { EVENT_TYPES } from "../../constants/eventTypes";
import { eventEmitter } from "../../core/EventEmitter";
import { INITIAL_STATE } from "./constants";

export class Modal extends Component {
  constructor() {
    super();

    this.template = template();
    this.state = INITIAL_STATE;
  }

  appendTemplate = (template) => {
    const tmp = document.createElement(template);
    this.querySelector(".modal-body").append(tmp);
  };

  modalHandler = ({ detail }) => {
    this.setState({
      ...this.state,
      ...detail,
    });

    if (detail.template) {
      this.appendTemplate(detail.template);
    }
  };

//   closeModal = () => {
//     this.setState(INITIAL_STATE);
//   };

//   onSuccess = () => {
//     this.state.onSuccess(this);
//     this.closeModal();
//   };

//   onClick = (evt) => {
//     if (evt.target.closest(".modal-reject-trigger")) {
//       this.closeModal();
//     }
//     if (evt.target.closest(".modal-success-trigger")) {
//       this.onSuccess();
//     }
//   };

  componentDidMount() {
    eventEmitter.on(EVENT_TYPES.modal, this.modalHandler);
// //     eventEmitter.on("form:error", this.validateForm);
//     this.addEventListener("click", this.onClick);
  }

  componentWillUnmount() {
    eventEmitter.off(EVENT_TYPES.modal, this.modalHandler);
// //     eventEmitter.off("form:error", this.validateForm);
//     this.removeEventListener("click", this.onClick);
  }
}

customElements.define("ui-modal", Modal);