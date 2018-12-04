import "./App.css";

import React, { Component } from "react";
import axios from "axios";

import { Menu } from "./components/Menu";
import { AddToBasket } from "./components/AddToBasket";

class App extends Component {
  state = {
    data: null,
    loading: true,
    error: null,
    activeItem: null
  };
  async componentWillMount() {
    try {
      const { data } = await axios.get(
        "http://localhost:3123/api/restarauntData"
      );
      this.setState({
        data,
        error: null,
        loading: false
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false
      });
    }
  }

  selectItem = (id) => {
    this.setState({ activeItem: id });
  };

  render() {
    const { loading, data, error, activeItem } = this.state;

    if (error) {
      return <div>{JSON.stringify(error)}</div>;
    }

    if (loading) {
      return <div>loading...</div>;
    }

    return (
      <div className="app">
        <Menu data={data} onItemClick={this.selectItem} />
        {activeItem && (
          <AddToBasket key={activeItem} data={data} pId={activeItem} />
        )}
      </div>
    );
  }
}

export default App;
