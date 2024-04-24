import { getExpenseApi } from "../../api/transactions";
import { Component } from "../../core/Component";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useUserStore } from "../../hooks/useUserStore";
import { mapResponseApiData } from "../../utils/api";
import template from "./expbalance.template.hbs";

export class ExpBalance extends Component {
  constructor() {
    super();
    this.template = template();
    this.state = {
        arrbalance: [],
        expbalance: 0,
    };
  }

  setUser() {
    const { getUser } = useUserStore();
    this.setState({
      ...this.state,
      user: getUser(),
    });
  }
  
  changeBalance = () => {
    if (this.state.user?.uid) {
      getExpenseApi(this.state.user.uid)
        .then(({ data }) => {
          this.setState({
            ...this.state,
            arrbalance: data ? mapResponseApiData(data) : [],
            expbalance: mapResponseApiData(data).arrbalance.reduce((prev, current) => (prev += Number(current.sum)), 0),
           
          }); 
          console.log(this.expbalance);
        })
        .catch(({ message }) => {
          useToastNotification({ message });
        })
        .finally(() => {
        
        });
      }
 }


  componentDidMount() {
    this.setUser();
    this.addEventListener('click', this.changeBalance);
  }

  componentWillUnmount() {
  }
}

customElements.define("exp-balance", ExpBalance);