import { Component } from "../../core/Component";
import template from "./expense.template.hbs";
import { createBoardApi, getBoardsApi } from "../../api/boards";
import { useUserStore } from "../../hooks/useUserStore";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";
import { TOAST_TYPE } from "../../constants/toast";


export class ExpensePage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
      // user: null,
      // boards: [],
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

  openExpenseModal() {
    useModal({
      isOpen: true,
      template: 'ui-create-expense-form',
      onSuccess: (modal) => {
        const form = modal.querySelector(".create-expense-form");
        const formData = extractFormData(form);
        console.log(formData);
        this.toggleIsLoading();
        createBoardApi(this.state.user.uid, formData)
          .then(({ data }) => {
            console.log(data);
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

  // loadAllBoards = () => {
    // if (this.state.user?.uid) {
  //     this.toggleIsLoading();
  //     getBoardsApi(this.state.user.uid)
  //       .then(({ data }) => { 
  //         this.setState({
  //           ...this.state,
  //           boards: data ? mapResponseApiData(data) : [],
  //         });
  //       })
  //       .catch(({ message }) => {
  //         useToastNotification({ message });
  //       })
  //       .finally(() => {
  //         this.toggleIsLoading();
  //       });
  //   // }
  // };

  componentDidMount(){
    console.log('expense');
    this.setUser();
    this.addEventListener('click', this.onClick);
    // this.loadAllBoards();
  }

  componentWillUnmount() {
    this.removeEventListener('clik', this.onClick)
  }
}

customElements.define("expense-page", ExpensePage);