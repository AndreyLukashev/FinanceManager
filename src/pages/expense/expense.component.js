import { Component } from "../../core/Component";
import template from "./expense.template.hbs";
import { createExpenseApi} from "../../api/transactions";
import { useUserStore } from "../../hooks/useUserStore";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";
import { TOAST_TYPE } from "../../constants/toast";
import { authService } from "../../services/Auth";


export class ExpensePage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      boardId: null,
      isLoading: false,
    }
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

  openExpenseModal() {
    useModal({
      isOpen: true,
      title: "Добавить расход",
      template: 'ui-create-expense-form',
      onSuccess: (modal) => {
        const form = modal.querySelector(".create-expense-form");
        const formData = extractFormData(form);
        this.toggleIsLoading();
        createExpenseApi(this.state.user.uid, formData)
          .then(({ data }) => {
            useNavigate(`${ROUTES.expense}`);
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

  onClick = ({target}) => {
    const logOut = target.closest('.logout');
    const workPage = target.closest('.work-page');
    const profitPage = target.closest('.profit-page');
    const addExpense = target.closest('.create-expense');

    if(logOut){
      this.logOut();
    }

    if(workPage){
      useNavigate(`${ROUTES.work}`);
    }

    if(profitPage){
      useNavigate(`${ROUTES.profit}`);
    }
    
    if(addExpense){
      this.openExpenseModal();
    }
  }

  componentDidMount(){
    this.setUser();
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener('clik', this.onClick)
  }
}

customElements.define("expense-page", ExpensePage);