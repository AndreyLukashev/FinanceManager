// balance.component.js
// changeTotalBalance = () => {
  //   if (this.state.user?.uid) {
  //     this.toggleIsLoading();
  //     getProfitApi(this.state.user.uid)
  //       .then(({ data }) => {
  //         this.setState({
  //           ...this.state,
  //           arrProfBalance: data ? mapResponseApiData(data) : [],
  //           profBalance: mapResponseApiData(data).reduce((prev, current) => (prev += Number(current.sum)), 0),
            
  //         });
  //       })
  //       .catch(({ message }) => {
  //         useToastNotification({ message });
  //       })
  //       .finally(() => {
  //         this.toggleIsLoading();
  //       });

  //       getExpenseApi(this.state.user.uid)
  //       .then(({ data }) => {
  //         this.setState({
  //           ...this.state,
  //           arrExpBalance: data ? mapResponseApiData(data) : [],
  //           expBalance: mapResponseApiData(data).reduce((prev, current) => (prev += Number(current.sum)), 0),
            // totalBalance: this.state.profBalance - this.state.expBalance,
  //         }); 
  //         console.log(this.state.profBalance, this.state.expBalance);
  //       })
  //       .catch(({ message }) => {
  //         useToastNotification({ message });
  //       })
  //       .finally(() => {
  //         this.toggleIsLoading();
  //       });
  //   }
  // }


  // // filterExpense = () => {
// //   if (this.state.user?.uid) {
// //     this.toggleIsLoading();
// //     getExpenseApi(this.state.user.uid)
// //       .then(({ data }) => {
// //         this.setState({
// //           ...this.state,
// //           arrFilter: data ? mapResponseApiData(data) : [],
// //           transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
//           // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
          
          
//       //   }); 
//       // })
//       // .catch(({ message }) => {
//       //   useToastNotification({ message });
//       // })
//       // .finally(() => {
//       //   this.toggleIsLoading();
//         // console.log(this.state.arrFilter);
//         // const today = new Date().valueOf();
//         // const selectedDay = new Date(this.state.arrFilter[2].date).valueOf()
//         // console.log(today, selectedDay, today < selectedDay);
//         // console.log(this.state.transactions);
// //         console.log(typeof(this.state.date), this.state.date);
        
// //       });
// //     }
// // }

//   onFilterCategories = ({ target }) => {
//     const field = target.closest('.filter-categories');
//     if (this.state.user?.uid) {
//       this.toggleIsLoading();
//       getExpenseApi(this.state.user.uid)
//         .then(({ data }) => {
//           this.setState({
//             ...this.state,
//             // transactions: mapResponseApiData(data).filter(item => item.sum < 1000)
//             // transactions: mapResponseApiData(data).filter(item => item.date == new Date())
//             transactions: mapResponseApiData(data).filter(item => item.categories == field.value)
//           }); 
//         })
//         .catch(({ message }) => {
//           useToastNotification({ message });
//         })
//         .finally(() => {
//           this.toggleIsLoading();
//           // console.log(this.state.arrFilter);
//           // console.log(typeof(this.state.arrFilter[1].date), this.state.arrFilter[1].date);
//         });
//     }
//   }

//     // this.addEventListener("change", this.onFilterCategories);

//     // this.removeEventListener("change", this.onFilterCategories);