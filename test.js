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