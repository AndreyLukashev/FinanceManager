import { createBoardApi } from "../../api/boards";
import { ROUTES } from "../../constants/routes";
import { TOAST_TYPE } from "../../constants/toast";
import { Component } from "../../core/Component";
import { useModal } from "../../hooks/useModal";
import { useNavigate } from "../../hooks/useNavigate";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { extractFormData } from "../../utils/extractFormData";
import template from "./profit.template.hbs";

export class ProfitPage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
    };
  }

  toggleIsLoading = () => {
    this.setState({
      ...this.state,
      isLoading: !this.state.isLoading,
    });
  };

  setUser() {
    const { getUser } = useUserStore();
    this.setState({
      ...this.state,
      user: getUser(),
    });
  }

  onClick = ({target}) => {
    const logOut = target.closest('.logout');
    const workPage = target.closest('.work-page');
    const expensePage = target.closest('.expense-page');
    const addProfit = target.closest('.create-profit');

    if(logOut){
      this.logOut();
    }

    if(workPage){
      useNavigate(`${ROUTES.work}`);
    }

    if(expensePage){
      useNavigate(`${ROUTES.expense}`);
    }

    if(addProfit){
      this.openProfitModal();
    }
  }

  openProfitModal() {
    useModal({
      isOpen: true,
      template: 'ui-create-profit-form',
      onSuccess: (modal) => {
        const form = modal.querySelector(".create-profit-form");
        const formData = extractFormData(form);
        this.toggleIsLoading();
        createBoardApi(this.state.user.uid, formData)
          .then(({ data }) => {
            useNavigate(`${ROUTES.profit}`);
            useToastNotification({
              message: "Success!",
              type: TOAST_TYPE.success,
            });
          })
          .catch(({ message }) => {
            useToastNotification({ message });
          })
          .finally(() => {
            this.toggleIsLoading();
          });
      },
    })
  }

  componentDidMount() {
    this.setUser();
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener('clik', this.onClick)
  }
}

customElements.define("profit-page", ProfitPage);