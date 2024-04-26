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
      arrProfTotalBalance: [],
      profTotalBalance: 0,
      arrExpTotalBalance: [],
      expTotalBalance: 0,
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
            arrProfTotalBalance: data ? mapResponseApiData(data) : [],
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
              arrExpTotalBalance: data ? mapResponseApiData(data) : [],
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

  // onFilter = ({ target }) => {
  //   const field = target.closest('.filter-categories');
  //   console.log(field, field.value)
  //   if (this.state.user?.uid) {
  //     this.toggleIsLoading();
  //     getExpenseApi(this.state.user.uid)
  //       .then(({ data }) => {
  //         this.setState({
  //           ...this.state,
  //           arrExpBalance: data ? mapResponseApiData(data) : [],
            // transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
            // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
        //     transactions: mapResponseApiData(data).filter(item => item.categories == field.value)
        //     expBalance:
        //   }); 
        // })
        // .catch(({ message }) => {
        //   useToastNotification({ message });
        // })
        // .finally(() => {
        //   this.toggleIsLoading();
          // console.log(this.state.arrFilter);
          // console.log(typeof(this.state.arrFilter[1].date), this.state.arrFilter[1].date);
          // console.log(this.state.transactions);
          // console.log(typeof(this.state.date), this.state.date);
          
  //       });
  //     }
  // }

  componentDidMount() {
    this.setUser();
    this.countBalance();
    // document.addEventListener("change", this.onFilter);
  }

  componentWillUnmount() {
    // document.removeEventListener("change", this.onFilter);
  }
}

customElements.define("ui-total-balance", TotalBalance);
