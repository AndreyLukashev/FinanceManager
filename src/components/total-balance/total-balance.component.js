import { getExpenseApi, getProfitApi } from "../../api/transactions";
import { Component } from "../../core/Component";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { mapResponseApiData } from "../../utils/api";
import template from "./total-balance.template.hbs";

export class TotalBalance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
      profTotalBalance: 0,
      expTotalBalance: 0,
      filterBalance: 0,
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

  countBalance = () => {
    if (this.state.user?.uid) {
      this.toggleIsLoading();
      getProfitApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            profTotalBalance: mapResponseApiData(data).reduce((prev, current) => (prev += Number(current.sum)), 0),
          }); 
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
          this.countExpenseBalance();
        });
    }
  }
        
    countExpenseBalance = () => {
      if (this.state.user?.uid) {
        getExpenseApi(this.state.user.uid)
          .then(({ data }) => {
            this.setState({
              ...this.state,
              expTotalBalance: mapResponseApiData(data).reduce((prev, current) => (prev += Number(current.sum)), 0),
            }); 
          })
          .catch(({ message }) => {
            useToastNotification({ message });
          })
          .finally(() => {
            this.countTotalBalance();
          });
      }
    }
      
    countTotalBalance = () => {
      this.setState({
        ...this.state,
        totalBalance: this.state.profTotalBalance - this.state.expTotalBalance,
      })
    };

   
  componentDidMount() {
    this.setUser();
    this.countBalance();
    // document.addEventListener("change", this.onFilterBalance);
  }

  componentWillUnmount() {
    // document.removeEventListener("change", this.onFilterBalance);
  }
}

customElements.define("ui-total-balance", TotalBalance);
