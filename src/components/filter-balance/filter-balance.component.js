import { getExpenseApi, getProfitApi } from "../../api/transactions";
import { Component } from "../../core/Component";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { mapResponseApiData } from "../../utils/api";
import template from "./filter-balance.template.hbs";

export class FilterBalance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      
      
      arrExpFilterBalance: [],
      expFilterBalance: 0,
      
    };
  }

  toggleIsLoading = () => {
    this.setState({
      ...this.state,
      isLoading: !this.state.isLoading,
    });
  };


  changeFilterBalance = ({ target }) => {
    console.log('filter');
    const field = target.closest('.filter-categories')
    const { getUser } = useUserStore();
    const user = getUser();
    if (user?.uid) {
      this.toggleIsLoading();
      Promise.all([
        
        getExpenseApi(user.uid),
      ])
        .then(([expense]) => {
          
          const mappedExpense = mapResponseApiData(expense.data) ?? [];
          
          const expFilterBalance = mappedExpense.reduce(
            (prev, current) => (prev += Number(current.sum)),0);
          // mappedExpense.filter(item => item.categories == field.value);
          this.setState({
            ...this.state,
            user,
           
            arrExpFilterBalance: mappedExpense.filter(item => item.categories == field.value),
            
            expFilterBalance,
            
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
    // this.changeFilterBalance();
    document.addEventListener("change", this.changeFilterBalance);
  }

  componentWillUnmount() {
    // document.removeEventListener("change", this.onFilter);
  }
}

customElements.define("ui-filter-balance", FilterBalance);
