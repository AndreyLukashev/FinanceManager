import { Component } from "../../core/Component";
import template from "./filter-expense-balance.template.hbs";
import { useUserStore } from "../../hooks/useUserStore";
import { getExpenseApi} from "../../api/transactions";
import { useToastNotification } from "../../hooks/useToastNotification";
import { mapResponseApiData } from "../../utils/api";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";


export class FilterExpenseBalance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
      user: null,
      transactions: [],
      
//       // arrExpFilterBalance: [],
      filterBalance: 0,
      filterName: "Фильтр",
      categoryName: "Выберите категорию",
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

  loadAllTransactions = () => {
    if (this.state.user?.uid) {
      this.toggleIsLoading();
        getExpenseApi(this.state.user.uid)
          .then(({ data }) => {
            this.setState({
              ...this.state,
              transactions: mapResponseApiData(data).sort((a, b) => a.date < b.date ? 1 : -1),
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

  // onFilterBalance = ({ target }) => {
  //   const field = target.closest('.categories-balance-expense');

  //   if(field){
  //     if (this.state.user?.uid) {
  //       getExpenseApi(this.state.user.uid)
  //         .then(({ data }) => {
  //           this.setState({
  //             ...this.state,
  //             transactions: mapResponseApiData(data).filter(item => item.categories === field.value).sort((a, b) => a.date < b.date ? 1 : -1),                filterBalance: mapResponseApiData(data).filter(item => item.categories === field.value).reduce((prev, current) => (prev += Number(current.sum)), 0),
  //             filterName: field.value,
  //             categoryName: field.value,
  //           });
  //         })
  //         .catch(({ message }) => {
  //           useToastNotification({ message });
  //         })
  //         .finally(() => {
  //           this.toggleIsLoading();
  //         });
  //       }
  //     }
  //   }

    

    openFilterModal() {
      useModal({
        isOpen: true,
        title: "Фильтр",
        template: 'ui-create-expfilter-form',
        onSuccess: (modal) => {
          const form = modal.querySelector(".create-expfilter-form");
          const formData = extractFormData(form);
          this.toggleIsLoading();
          getExpenseApi(this.state.user.uid)
          .then(({ data }) => {
          const startDate = formData.startdate;
          const endDate = formData.enddate;
          const strDate = Number(startDate.replace(/-/g, ''));
          const enDate = Number(endDate.replace(/-/g, ''));
          const transactions1 = mapResponseApiData(data).filter(item => item.categories === formData.categories);
          const transactions2 = transactions1.filter(item =>  Number(item.date.replace(/-/g, '')) >= strDate);
          const transactions3 = transactions2.filter(item =>  Number(item.date.replace(/-/g, '')) <= enDate);

          console.log(transactions1);
          console.log(transactions2);
          console.log(transactions3);
          
            this.setState({
              ...this.state,
              transactions: transactions3,
              // mapResponseApiData(data)
              //               .filter(
              //                 (item => item.categories === formData.categories)
              //               && (item =>  Number(item.date.replace(/-/g, '')) === strDate)
                            // && 
                            // (item => Number(item.date.replace(/-/g, '')) === strDate)
                            // && 
                            // (item =>  Number(item.date.replace(/-/g, '')) >= enDate)
                            // &&
                            //  (item =>  Number(item.date.replace(/-/g, '')) >= enDate)
                            // )
                            //  .sort((a, b) => a.date < b.date ? 1 : -1),
                            //  transactions: mapResponseApiData(data)
                            //  .filter((item => item.categories === formData.categories)
                            //   && (item => strDate <=  Number(item.date.replace(/-/g, '')))
                            //   &&(item => Number(item.date.replace(/-/g, '')) <= enDate))
                              // .sort((a, b) => a.date < b.date ? 1 : -1),
                                              
              filterBalance: transactions3.reduce((prev, current) => (prev += Number(current.sum)), 0),
              // filterBalance: mapResponseApiData(data).filter((item => item.categories === formData.categories) && (item => item.date === formData.enddate)).reduce((prev, current) => (prev += Number(current.sum)), 0),
              // filterName: field.value,
              // categoryName: field.value,
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

    onClick = ({target}) => {
      const filterBtn = target.closest('.filterbtn');
      const filterResetBtn = target.closest('.filterbtn-reset');
      
      if(filterBtn){
        this.openFilterModal()
      }

      if(filterResetBtn){
        this.loadAllTransactions()
      }
  
    }
    

  componentDidMount() {
    this.setUser();
    this.loadAllTransactions();
    this.addEventListener("change", this.onFilterBalance);
    this.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    this.removeEventListener("change", this.onFilterBalance);
    this.removeEventListener('click', this.onClick)
  }
}

customElements.define("ui-filter-expense-balance", FilterExpenseBalance);

//   onFilterBalance = ({ target }) => {
//     const field = target.closest('.filter-balance-expense');
//     if (this.state.user?.uid) {
//       getExpenseApi(this.state.user.uid)
//         .then(({ data }) => {
//           this.setState({
//             ...this.state,
//             filterBalance: mapResponseApiData(data).filter(item => item.categories === field.value).reduce((prev, current) => (prev += Number(current.sum)), 0),
//             filterTitle: field.value,
//           });
          
//         })
//         .catch(({ message }) => {
//           useToastNotification({ message });
//         })
//         .finally(() => {
//           this.toggleIsLoading();
//         });
//     }
//   }


// // transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
//             // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
//             // console.log(typeof(this.state.arrFilter[1].date), this.state.arrFilter[1].date);
//           // console.log(this.state.filterBalance);

//           // changeFilterBalance = ({ target }) => {
//   //   console.log('filter');
//   //   const field = target.closest('.filter-categories')
//   //   const { getUser } = useUserStore();
//   //   const user = getUser();
//   //   if (user?.uid) {
//   //     this.toggleIsLoading();
//   //     Promise.all([
        
//   //       getExpenseApi(user.uid),
//   //     ])
//   //       .then(([expense]) => {
          
//   //         const mappedExpense = mapResponseApiData(expense.data) ?? [];
          
//   //         const expFilterBalance = mappedExpense.reduce(
//   //           (prev, current) => (prev += Number(current.sum)),0);
//           // mappedExpense.filter(item => item.categories == field.value);
//   //         this.setState({
//   //           ...this.state,
//   //           user,
           
//   //           arrExpFilterBalance: mappedExpense.filter(item => item.categories == field.value),
            
//   //           expFilterBalance,
            
//   //         });
//   //       })
//   //       .catch(({ message }) => {
//   //         useToastNotification({ message });
//   //       })
//   //       .finally(() => {
//   //         this.toggleIsLoading();
//   //       });
//   //   }
//   // };

//   // onFilter = ({ target }) => {
//   //   const field = target.closest('.filter-categories');
//   //   console.log(field, field.value)
//   //   if (this.state.user?.uid) {
//   //     this.toggleIsLoading();
//   //     getExpenseApi(this.state.user.uid)
//   //       .then(({ data }) => {
//   //         this.setState({
//   //           ...this.state,
//   //           arrExpBalance: data ? mapResponseApiData(data) : [],
//             // transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
//             // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
//         //     transactions: mapResponseApiData(data).filter(item => item.categories == field.value)
//         //     expBalance:
//         //   }); 
//         // })
//         // .catch(({ message }) => {
//         //   useToastNotification({ message });
//         // })
//         // .finally(() => {
//         //   this.toggleIsLoading();
//           // console.log(this.state.arrFilter);
//           // console.log(typeof(this.state.arrFilter[1].date), this.state.arrFilter[1].date);
//           // console.log(this.state.transactions);
//           // console.log(typeof(this.state.date), this.state.date);
          
//   //       });
//   //     }
//   // }