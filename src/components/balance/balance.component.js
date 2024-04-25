import { getExpenseApi, getProfitApi } from "../../api/transactions";
import { Component } from "../../core/Component";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { mapResponseApiData } from "../../utils/api";
import template from "./balance.template.hbs";

export class Balance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
        arrProfBalance: [],
        profBalance: 0,
        arrExpBalance: [],
        expBalance: 0,
        totalBalance: 0,
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

  changeProfitBalance = () => {
    if (this.state.user?.uid) {
      this.toggleIsLoading();
      getProfitApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            arrProfBalance: data ? mapResponseApiData(data) : [],
            profBalance: mapResponseApiData(data).reduce((prev, current) => (prev += Number(current.sum)), 0),
          }); 
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
          this.toggleIsLoading();
          this.changeExpenseBalance();
        });
      }
  }
  
  changeExpenseBalance = () => {
    if (this.state.user?.uid) {
      this.toggleIsLoading();
      getExpenseApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            arrExpBalance: data ? mapResponseApiData(data) : [],
            expBalance: mapResponseApiData(data).reduce((prev, current) => (prev += Number(current.sum)), 0),
            
          }); 
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
          this.toggleIsLoading();
          this.changeTotalBalance();
        });
      }
  }

  changeTotalBalance = () => {
    this.setState({
      ...this.state,
      totalBalance: this.state.profBalance - this.state.expBalance,
    })
  }

  componentDidMount() {
    this.setUser();
    this.changeProfitBalance();
  }

}

customElements.define("ui-balance", Balance);