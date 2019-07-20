import "./App.css";
import React, { Component } from "react";
import NavBar from "./components/NavBar";
import TextFields from "./components/TextFields";
import SearchBar from "material-ui-search-bar";
import CustomizedTables from "./components/CustomizedTables";
import ReactDOM from "react-dom";
import { StockInfo } from "./Model/StockInfo";

class App extends Component {
  constructor() {
    super();
    stockInfo: new Object();

    this.state = {
      token: "",
      min: "",
      StockInfoComponentVisible: false,
      stockInfo: []
    };
    this.login();
    // this.handleClick = this.handleClick.bind(this);
  }
  async login() {
    await fetch(
      "https://sit-api.morrisons.com/user/v1/login?apikey=ZwQGsEN0f65kORZ8EVQlJWA2bGNbHls0",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: "789987",
          provider: "morrisons",
          userName: "10020030"
        })
      }
    )
      .then(loginResponse => loginResponse.json())

      .then(jsonData => {
        // jsonData is parsed json object received from url
        console.log(jsonData.accessToken);
        this.token = jsonData.accessToken;
      })
      .catch(error => {
        // handle your errors here
        console.error(error);
      });
  }
  displayAlert = item => {
    // you can access the item object and the event object
    // alert(item);
    this.min = item;

    this.setState({
      StockInfoComponentVisible: !this.state.StockInfoComponentVisible
    });
    this.handleClick();
  };

  async handleClick() {
    console.log("min:::" + this.min);
    const response = await fetch(
      "https://sit-api.morrisons.com/space/v1/locations/8/items/" +
        this.min +
        "?exclude=ProductList&apikey=ZwQGsEN0f65kORZ8EVQlJWA2bGNbHls0",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token
        }
      }
    )
      // .then(response => response.json())
      .then(response => response.json())
      // .then(json => {
      //   this.setState({ stockInfo: json });
      // })
      .then(json => {
        this.setState({ stockInfo: json, StockInfoComponentVisible: true });

        if (this.state.stockInfo.httpResponseCode === 200) {
          console.log("SUCCESSS");
          this.setState({ stockInfo: json, StockInfoComponentVisible: true });
        } else if (this.state.stockInfo.httpResponseCode === 404) {
          console.log("SOMETHING WENT WRONG");
          this.setState({ StockInfoComponentVisible: false });
        }
      })
      .catch(error => {
        this.setState({ StockInfoComponentVisible: false });
        console.log("Catch :=SOMETHING WENT WRONG");
        // if (response.status === 404) {
        //   console.log("SOMETHING WENT WRONG");
        //   this.setState({ StockInfoComponentVisible: false });
        // }
      });

    console.log("Stockdata " + this.stockInfo);
  }

  render() {
    var { stockInfo } = this.state;
    return (
      <div className="button__container">
        <NavBar />
        <div id="container">
          {this.state.StockInfoComponentVisible && (
            <StockInfoComponent text={stockInfo}>Button</StockInfoComponent>
          )}
        </div>
        <SearchBar
          value={this.state.value}
          onChange={newValue => this.setState({ value: newValue })}
          onRequestSearch={() => this.displayAlert(this.state.value)}
          style={{
            margin: "0 auto",
            maxWidth: 800
          }}
        />
        {this.state.StockInfoComponentVisible ? (
          <div>
            <h3 >TotalFillQty: {stockInfo.totalFillQty}</h3>
          
            <h3 >Start Of Day Qty: {stockInfo.startOfDayQty} </h3>
           
            <h3 >End Of Day Qty: {stockInfo.endOfDayQty}</h3>
          </div>
        ) : (
          <div>
            <p>{"No Stock Information Found"}</p>
          </div>
        )}
      </div>
    );
  }
}

class StockInfoComponent extends Component {
  render() {
    const greeting = "Welcome to React";

    return <p>{""}</p>;
  }
}

export default App;
