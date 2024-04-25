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


  changeProfitBalance = () => {
    const { getUser } = useUserStore();
    const user = getUser();
    if (user?.uid) {
      this.toggleIsLoading();
      Promise.all([
        getProfitApi(user.uid),
        getExpenseApi(user.uid),
      ])
        .then(([profit, expense]) => {
          const mappedProfit = mapResponseApiData(profit.data) ?? [];
          const mappedExpense = mapResponseApiData(expense.data) ?? [];
          const profBalance = mappedProfit.reduce(
            (prev, current) => (prev += Number(current.sum)),
            0
          );
          const expBalance = mappedExpense.reduce(
            (prev, current) => (prev += Number(current.sum)),
            0
          );

          this.setState({
            ...this.state,
            user,
            arrProfBalance: mappedProfit,
            arrExpBalance: mappedExpense,
            profBalance,
            expBalance,
            totalBalance: profBalance - expBalance,
          });
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
          this.toggleIsLoading();
        });
    }
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
    this.changeProfitBalance();
    // document.addEventListener("change", this.onFilter);
  }

  componentWillUnmount() {
    // document.removeEventListener("change", this.onFilter);
  }
}

customElements.define("ui-balance", Balance);