import { Component } from "../../core/Component";
import template from "./expense.template.hbs";
import { useUserStore } from "../../hooks/useUserStore";
import { createExpenseApi, deleteExpenseApi, getExpenseApi} from "../../api/transactions";
import { useToastNotification } from "../../hooks/useToastNotification";
import { authService } from "../../services/Auth";
import { TOAST_TYPE } from "../../constants/toast";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";
import { mapResponseApiData } from "../../utils/api";

export class ExpensePage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      user: null,
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
          .then(( data ) => {
            useToastNotification({
              message: "Success!",
              type: TOAST_TYPE.success,
            });
            this.loadAllTransactions();
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

  loadAllTransactions = () => {
    if (this.state.user?.uid) {
      this.toggleIsLoading();
        getExpenseApi(this.state.user.uid)
          .then(({ data }) => {
            this.setState({
              ...this.state,
              transactions: mapResponseApiData(data).sort((a, b) => a.date < b.date ? 1 : -1),
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

  deleteTransaction ({id}) {
    useModal({
      isOpen: true,
      title: 'Удалить выбранный расход',
      confirmation: `Вы действительно хотите удалить этот расход`,
      successCaption: "Delete",
      onSuccess: () => {
          this.toggleIsLoading();
      deleteExpenseApi(this.state.user.uid, id)
        .then(() => {
          this.loadAllTransactions()
          useToastNotification({
            message: `Transaction was deleted`,
            type: TOAST_TYPE.success,
          });
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
          this.toggleIsLoading();
        });
      }
    })
  }
  
  onClick = ({target}) => {
    const logOut = target.closest('.logout');
    const workPage = target.closest('.work-page');
    const addExpense = target.closest('.create-expense');
    const profitPage = target.closest('.profit-page');
    const dltTransaction = target.closest('.delete-transaction');

    if(logOut){
      this.logOut();
    }

    if(workPage){
      useNavigate(`${ROUTES.work}`);
    }

    if(addExpense){
      this.openExpenseModal();
    }

    if(profitPage){
      useNavigate(`${ROUTES.profit}`);
    }

    if(dltTransaction){
      this.deleteTransaction({
        id: dltTransaction.dataset.id,
      });
    }
  }

  componentDidMount(){
    this.setUser();
    // this.loadAllTransactions();
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener('click', this.onClick)
  }
}

customElements.define("expense-page", ExpensePage);