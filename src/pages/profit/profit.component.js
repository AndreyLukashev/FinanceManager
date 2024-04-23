import { Component } from "../../core/Component";
import template from "./profit.template.hbs";
import { createProfitApi, getProfitApi} from "../../api/transactions";
import { useUserStore } from "../../hooks/useUserStore";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";
import { TOAST_TYPE } from "../../constants/toast";
import { authService } from "../../services/Auth";
import { mapResponseApiData } from "../../utils/api";

export class ProfitPage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
      user: null,
      boards: [],
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

  logOut = () => {
    this.toggleIsLoading();
    const { setUser } = useUserStore();
    authService
      .logOut()
      .then(() => {
        setUser(null);
        useToastNotification({ type: TOAST_TYPE.success, message: "Success!" });
        useNavigate(ROUTES.signIn);
      })
      .catch(({ message }) => {
        useToastNotification({ message });
      })
      .finally(() => {
        this.toggleIsLoading();
      });
  }

  openProfitModal() {
    useModal({
      isOpen: true,
      title: "Добавить доход",
      template: 'ui-create-profit-form',
      onSuccess: (modal) => {
        const form = modal.querySelector(".create-profit-form");
        const formData = extractFormData(form);
        this.toggleIsLoading();
        createProfitApi(this.state.user.uid, formData)
          .then(({ data }) => {
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

  loadAllBoards = () => {
    if (this.state.user?.uid) {
      console.log(this.state.user.uid);
      this.toggleIsLoading();
      getProfitApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            boards: data ? mapResponseApiData(data) : [],
          });
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
          this.toggleIsLoading();
        });
    }
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

  componentDidMount() {
    this.setUser();
    this.loadAllBoards();
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener('clik', this.onClick)
  }
}

customElements.define("profit-page", ProfitPage);