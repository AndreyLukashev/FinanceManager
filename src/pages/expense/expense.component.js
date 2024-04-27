import { Component } from "../../core/Component";
import template from "./expense.template.hbs";
import { createExpenseApi, deleteExpenseApi, getExpenseApi} from "../../api/transactions";
import { useUserStore } from "../../hooks/useUserStore";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";
import { TOAST_TYPE } from "../../constants/toast";
import { authService } from "../../services/Auth";
import { mapResponseApiData } from "../../utils/api";
import { eventEmitter } from "../../core/EventEmitter";

// ___________________________________________________________________

export class ExpensePage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      user: null,
      transactions: [],
      isLoading: false,
      arrFilter: [],
      date: new Date()
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

  deleteTransaction ({id}) {
    useModal({
      isOpen: true,
      title: 'Delete transaction',
      confirmation: `Do you really want to delete transaction`,
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
  

// filterExpense = () => {
//   if (this.state.user?.uid) {
//     this.toggleIsLoading();
//     getExpenseApi(this.state.user.uid)
//       .then(({ data }) => {
//         this.setState({
//           ...this.state,
//           arrFilter: data ? mapResponseApiData(data) : [],
//           transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
          // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
          
          
      //   }); 
      // })
      // .catch(({ message }) => {
      //   useToastNotification({ message });
      // })
      // .finally(() => {
      //   this.toggleIsLoading();
        // console.log(this.state.arrFilter);
        // const today = new Date().valueOf();
        // const selectedDay = new Date(this.state.arrFilter[2].date).valueOf()
        // console.log(today, selectedDay, today < selectedDay);
        // console.log(this.state.transactions);
//         console.log(typeof(this.state.date), this.state.date);
        
//       });
//     }
// }

  onClick = ({target}) => {
    const logOut = target.closest('.logout');
    const workPage = target.closest('.work-page');
    const profitPage = target.closest('.profit-page');
    const addExpense = target.closest('.create-expense');
    const dltTransaction = target.closest('.delete-transaction');
    const filterbtn = target.closest('.filter');

    if(filterbtn){
      this.filterExpense()
    }


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

    if(dltTransaction){
      this.deleteTransaction({
        id: dltTransaction.dataset.id,
      });
    }
  }

  onFilterCategories = ({ target }) => {
    const field = target.closest('.filter-categories');
    if (this.state.user?.uid) {
      this.toggleIsLoading();
      getExpenseApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            // transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
            // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
            transactions: mapResponseApiData(data).filter(item => item.categories == field.value)
          }); 
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
          this.toggleIsLoading();
          // console.log(this.state.arrFilter);
          // console.log(typeof(this.state.arrFilter[1].date), this.state.arrFilter[1].date);
        });
    }
  }
// ___________________________________________________________________

  componentDidMount(){
    this.setUser();
    this.loadAllTransactions();
    this.addEventListener('click', this.onClick);
    // this.addEventListener("change", this.onFilterCategories);
  }

  componentWillUnmount() {
    this.removeEventListener('click', this.onClick)
    // this.removeEventListener("change", this.onFilterCategories);
  }
}

customElements.define("expense-page", ExpensePage);