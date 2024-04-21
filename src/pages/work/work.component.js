import { Component } from "../../core/Component";
import template from "./work.template.hbs";
import { useUserStore } from "../../hooks/useUserStore";
import { authService } from "../../services/Auth";
import { useToastNotification } from "../../hooks/useToastNotification";
import { TOAST_TYPE } from "../../constants/toast";
import { useNavigate } from "../../hooks/useNavigate";
import { ROUTES } from "../../constants/routes";

export class WorkPage extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
    };
  }

  onClick = ({target}) => {
    const logOut = target.closest('.logout');
    const profit = target.closest('.profit-page');
    const expense = target.closest('.expense-page');

    if(logOut){
      this.logOut();
    }

    if(profit){
      useNavigate(`${ROUTES.profit}`);
    }
    
    if(expense){
      useNavigate(`${ROUTES.expense}`);
    }
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

  componentDidMount() {
    this.setUser();
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener('clik', this.onClick)
  }
 
}

customElements.define("work-page", WorkPage);