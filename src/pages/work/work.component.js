import { Component } from "../../core/Component";
import template from "./work.template.hbs";
// import { apiService } from "../../services/Api";
// import { mapResponseApiData } from "../../utils/api";
import { useUserStore } from "../../hooks/useUserStore";
import { authService } from "../../services/Auth";
import { useToastNotification } from "../../hooks/useToastNotification";
import { TOAST_TYPE } from "../../constants/toast";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";
// import { store } from "../../store/Store";
import { useModal } from "../../hooks/useModal";
// import { extractFormData } from "../../utils/extractFormData";
// import { createBoardApi, deleteBoardApi, getBoardsApi } from "../../api/boards";

export class WorkPage extends Component {
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

//   loadAllBoards = () => {
//     if (this.state.user?.uid) {
//       this.toggleIsLoading();
//       getBoardsApi(this.state.user.uid)
//         .then(({ data }) => { 
//           this.setState({
//             ...this.state,
//             boards: data ? mapResponseApiData(data) : [],
//           });
//         })
//         .catch(({ message }) => {
//           useToastNotification({ message });
  //       })
  //       .finally(() => {
  //         this.toggleIsLoading();
  //       });
  //   }
  // };

  openProfitModal() {
    useModal({
      isOpen: true,
      template: 'ui-create-profit-form',
      onSuccess: (modal) => {
        console.log("modal", modal);
  //       const form = modal.querySelector(".create-profit-form");
  //       console.log("form", form);
  //       const formData = extractFormData(form);
  //       console.log('formData', formData);
      },
    })
  }


  openExpenseModal() {
    useModal({
      isOpen: true,
      template: 'ui-create-expense-form',
  //     onSuccess: (modal) => {
  //       console.log("modal", modal);
  //       const form = modal.querySelector(".add-expense-form");
  //       console.log("form", form);
  //       const formData = extractFormData(form);
  //       console.log('formData', formData);
  //       this.toggleIsLoading();
  //       createBoardApi(this.state.user.uid, formData)
  //         .then(({ data }) => {
            // useNavigate(`${ROUTES.board}/${data.name}`);
  //           useToastNotification({
  //             message: "Success!",
  //             type: TOAST_TYPE.success,
  //           });
  //         })
  //         .catch(({ message }) => {
  //           useToastNotification({ message });
  //         })
  //         .finally(() => {
  //           this.toggleIsLoading();
  //         });
  //     },
    })
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

  onClick = ({target}) => {
    const logOut = target.closest('.logout');
    const addProfit = target.closest('.add-profit');
    const addExpense = target.closest('.add-expense');

    if(logOut){
      this.logOut();
    }

    if(addProfit){
      this.openProfitModal();
    }
    
    if(addExpense){
      this.openExpenseModal();
    }
  }

  setUser() {
    const { getUser } = useUserStore();
    this.setState({
      ...this.state,
      user: getUser(),
    });
  }

  componentDidMount() {
    this.setUser();
    // this.loadAllBoards();
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener('clik', this.onClick)
  }
 
}

customElements.define("work-page", WorkPage);