import { Component } from "../../core/Component";
import template from "./profit.template.hbs";
import { useUserStore } from "../../hooks/useUserStore";
import { createProfitApi, deleteProfitApi, getProfitApi} from "../../api/transactions";
import { useToastNotification } from "../../hooks/useToastNotification";
import { mapResponseApiData } from "../../utils/api";
import { authService } from "../../services/Auth";
import { TOAST_TYPE } from "../../constants/toast";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";

export class ProfitPage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      user: null,
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

  loadAllTransactions = () => {
    if (this.state.user?.uid) {
      this.toggleIsLoading();
      getProfitApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            transactions: data ? mapResponseApiData(data) : [],
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

  deleteTransaction ({id}) {
    useModal({
      isOpen: true,
      title: 'Удаление выбранный доход',
      confirmation: `Вы действительно хотите удалить этот доход`,
      successCaption: "Delete",
      onSuccess: () => {
          this.toggleIsLoading();
      deleteProfitApi(this.state.user.uid, id)
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
    const addProfit = target.closest('.create-profit');
    const expensePage = target.closest('.expense-page');
    const dltTransaction = target.closest('.delete-transaction');

    if(logOut){
      this.logOut();
    }

    if(workPage){
      useNavigate(`${ROUTES.work}`);
    }

    if(addProfit){
      this.openProfitModal();
    }

    if(expensePage){
      useNavigate(`${ROUTES.expense}`);
    }

    if(dltTransaction){
      this.deleteTransaction({
        id: dltTransaction.dataset.id,
      });
    }
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