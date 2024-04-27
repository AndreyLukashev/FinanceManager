import {getProfitApi } from "../../api/transactions";
import { Component } from "../../core/Component";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { mapResponseApiData } from "../../utils/api";
import template from "./filter-profit-balance.template.hbs";

export class FilterProfitBalance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
      isLoading: false,
    //   arrExpFilterBalance: [],
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
    const field = target.closest('.filter-balance-profit');
    if (this.state.user?.uid) {
      getProfitApi(this.state.user.uid)
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

customElements.define("ui-filter-profit-balance", FilterProfitBalance);
