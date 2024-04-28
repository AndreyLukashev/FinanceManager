import { getExpenseApi} from "../../api/transactions";
import { Component } from "../../core/Component";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { mapResponseApiData } from "../../utils/api";
import template from "./test-filter.template.hbs";

export class TestFilter extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
      // arrExpFilterBalance: [],
      filterBalance: 0,
      filterTitle: "Фильтр",
      filterDate: [],
      startPeriod: null,
      endPeriod: null,
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
    const field = target.closest('.filter-balance');
    const filterDay = target.closest('.filter-day');
    const filterWeek = target.closest('.filter-week');
    const filterMonth = target.closest('.filter-month');
    const filterYear = target.closest('.filter-year');
    const filterPeriod = target.closest('.end-period');

    if(field){
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

    if(filterDay){
        if (this.state.user?.uid) {
            getExpenseApi(this.state.user.uid)
              .then(({ data }) => {
                const currentDate = new Date; 
                const strCurrentDay = currentDate.toISOString().slice(0, 10)
                this.setState({
                  ...this.state,
                  filterBalance: mapResponseApiData(data).filter(item => item.date === strCurrentDay).reduce((prev, current) => (prev += Number(current.sum)), 0),
                  filterTitle: "За день"
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

    if(filterWeek){
      if (this.state.user?.uid) {
          getExpenseApi(this.state.user.uid)
            .then(({ data }) => {
              const currentDate = new Date; 
              const strCurrentDay = currentDate.toISOString().slice(0, 10)
              this.setState({
                ...this.state,
                filterBalance: mapResponseApiData(data).filter(item => item.date === strCurrentDay).reduce((prev, current) => (prev += Number(current.sum)), 0),
                filterTitle: "За день"
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

    if(filterMonth){
      if (this.state.user?.uid) {
          getExpenseApi(this.state.user.uid)
            .then(({ data }) => {
              const currentDate = new Date; 
              const strCurrentMonth = currentDate.toISOString().slice(5, 7)
              this.setState({
                ...this.state,
                filterBalance: mapResponseApiData(data).filter(item => item.date.slice(5, 7) === strCurrentMonth).reduce((prev, current) => (prev += Number(current.sum)), 0),
                filterTitle: "За месяц"
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

    if(filterYear){
      if (this.state.user?.uid) {
          getExpenseApi(this.state.user.uid)
            .then(({ data }) => {
              const currentDate = new Date; 
              const strCurrentYear = currentDate.toISOString().slice(0, 4)
              this.setState({
                ...this.state,
                filterBalance: mapResponseApiData(data).filter(item => item.date.slice(0, 4) === strCurrentYear).reduce((prev, current) => (prev += Number(current.sum)), 0),
                filterTitle: "За год"
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

  if(filterPeriod){
    console.log('period');
    if (this.state.user?.uid) {
        getExpenseApi(this.state.user.uid)
          .then(({ data }) => {
    //         const currentDate = new Date; 
    //         const strCurrentYear = currentDate.toISOString().slice(0, 4)
            this.setState({
              ...this.state,
              startPeriod: this.getAttribute("start-period"),
              endPeriod: this.getAttribute("end-period"),
    //           filterBalance: mapResponseApiData(data).filter(item => item.date.slice(0, 4) === strCurrentYear).reduce((prev, current) => (prev += Number(current.sum)), 0),
    //           filterTitle: "За год"
            }); 
            console.log(this.state.startPeriod);
            console.log(this.state.endPeriod);
          })
          .catch(({ message }) => {
            useToastNotification({ message });
          })
          .finally(() => {
            this.toggleIsLoading();
            
          });
    }
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

customElements.define("ui-test-filter", TestFilter);

// console.log(typeof(currentDate.toISOString()), currentDate.toISOString());
// console.log(strCurrentDay);
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

  // console.log(typeof(date.getFullYear()), date.getFullYear()); 
                // console.log(typeof(date.getMonth()), date.getMonth()); 
                // console.log(typeof(date.getDate()), date.getDate());  
                // console.log(typeof(this.state.filterDate[1].date), this.state.filterDate[1].date);
                // console.log(Date.parse(this.state.filterDate[1].date));