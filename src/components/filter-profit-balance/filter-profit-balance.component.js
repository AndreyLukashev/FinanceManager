import { Component } from "../../core/Component";
import template from "./filter-profit-balance.template.hbs";
import { useUserStore } from "../../hooks/useUserStore";
import {getProfitApi } from "../../api/transactions";
import { useToastNotification } from "../../hooks/useToastNotification";
import { mapResponseApiData } from "../../utils/api";
import { useModal } from "../../hooks/useModal";
import { extractFormData } from "../../utils/extractFormData";

export class FilterProfitBalance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
      user: null,
      transactions: [],
      filterBalance: 0,
      startDate: "______________",
      endDate: "______________",
      categories: "______________",
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
        getProfitApi(this.state.user.uid)
          .then(({ data }) => {
            this.setState({
              ...this.state,
              transactions: mapResponseApiData(data).sort((a, b) => a.date < b.date ? 1 : -1),
              filterBalance: 0,
              startDate: "______________",
              endDate: "______________",
              categories: "______________",
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

    openFilterModal() {
      useModal({
        isOpen: true,
        title: "Фильтр",
        template: 'ui-create-proffilter-form',
        onSuccess: (modal) => {
          const form = modal.querySelector(".create-proffilter-form");
          const formData = extractFormData(form);
          this.toggleIsLoading();
          getProfitApi(this.state.user.uid)
          .then(({ data }) => {
          const startDate = formData.startdate;
          const endDate = formData.enddate;
          const strDate = Number(startDate.replace(/-/g, ''));
          const enDate = Number(endDate.replace(/-/g, ''));
          const transactions1 = mapResponseApiData(data).filter(item => item.categories === formData.categories);
          const transactions2 = transactions1.filter(item =>  Number(item.date.replace(/-/g, '')) >= strDate);
          const transactions3 = transactions2.filter(item =>  Number(item.date.replace(/-/g, '')) <= enDate);
          
            this.setState({
              ...this.state,
              transactions: transactions3,
              filterBalance: transactions3.reduce((prev, current) => (prev += Number(current.sum)), 0),
              startDate: startDate,
              endDate: endDate,
              categories: formData.categories.toLowerCase(),
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
    this.addEventListener('click', this.onClick);
    
  }

  componentWillUnmount() {
    
  }
}

customElements.define("ui-filter-profit-balance", FilterProfitBalance);
