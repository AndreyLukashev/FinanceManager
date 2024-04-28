import { getExpenseApi} from "../../api/transactions";
import { Component } from "../../core/Component";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { mapResponseApiData } from "../../utils/api";
import template from "./filter-expense-balance.template.hbs";

export class FilterExpenseBalance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
      // arrExpFilterBalance: [],
      filterBalance: 0,
      filterTitle: "Фильтр",
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

  onFilterBalance = ({ target }) => {
    const field = target.closest('.filter-balance-expense');
    if (this.state.user?.uid) {
      getExpenseApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            filterBalance: mapResponseApiData(data).filter(item => item.categories === field.value).reduce((prev, current) => (prev += Number(current.sum)), 0),
            filterTitle: field.value,
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


  componentDidMount() {
    this.setUser();
    this.addEventListener("change", this.onFilterBalance);
  }

  componentWillUnmount() {
    this.removeEventListener("change", this.onFilterBalance);
  }
}

customElements.define("ui-filter-expense-balance", FilterExpenseBalance);


// transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
            // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
            // console.log(typeof(this.state.arrFilter[1].date), this.state.arrFilter[1].date);
          // console.log(this.state.filterBalance);

          // changeFilterBalance = ({ target }) => {
  //   console.log('filter');
  //   const field = target.closest('.filter-categories')
  //   const { getUser } = useUserStore();
  //   const user = getUser();
  //   if (user?.uid) {
  //     this.toggleIsLoading();
  //     Promise.all([
        
  //       getExpenseApi(user.uid),
  //     ])
  //       .then(([expense]) => {
          
  //         const mappedExpense = mapResponseApiData(expense.data) ?? [];
          
  //         const expFilterBalance = mappedExpense.reduce(
  //           (prev, current) => (prev += Number(current.sum)),0);
          // mappedExpense.filter(item => item.categories == field.value);
  //         this.setState({
  //           ...this.state,
  //           user,
           
  //           arrExpFilterBalance: mappedExpense.filter(item => item.categories == field.value),
            
  //           expFilterBalance,
            
  //         });
  //       })
  //       .catch(({ message }) => {
  //         useToastNotification({ message });
  //       })
  //       .finally(() => {
  //         this.toggleIsLoading();
  //       });
  //   }
  // };

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