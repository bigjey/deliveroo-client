import "./AddToBasket.css";

import React from "react";
import axios from "axios";

export class AddToBasket extends React.Component {
  state = {
    qty: 1,
    modifiers: {},
    added: false
  };

  dec = () => {
    this.setState({ qty: this.state.qty - 1 });
  };

  inc = () => {
    this.setState({ qty: this.state.qty + 1 });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    let mods = {};

    for (let c of Object.values(this.state.modifiers)) {
      for (let productId of Object.keys(c)) {
        if (c[productId] !== 0) {
          mods[productId] = 1;
        }
      }
    }

    const payload = {
      qty: this.state.qty,
      itemId: this.props.pId,
      modifiers: mods
    };

    try {
      await axios.post("http://localhost:3123/api/basket", payload);

      this.setState({ added: true });
    } catch (e) {
      console.log(e);
    }
  };

  toggleModifier = (e, cId, pId) => {
    const multi = this.props.data.categoriesById[cId].multiselect;

    this.setState({
      modifiers: {
        ...this.state.modifiers,
        [cId]: multi
          ? {
              ...this.state.modifiers[cId],
              [pId]: Number(e.target.checked)
            }
          : {
              [pId]: 1
            }
      }
    });
  };

  render() {
    const { qty, modifiers, added } = this.state;
    const { data, pId } = this.props;

    if (added) {
      return <div>Item was added to basket!</div>;
    }

    const p = data.productsById[pId];

    let totalProductPrice = 0;

    totalProductPrice += p.price;

    for (let c of Object.values(modifiers)) {
      for (let productId of Object.keys(c)) {
        if (c[productId] !== 0) {
          totalProductPrice += data.productsById[productId].price;
        }
      }
    }

    return (
      <form className="add-to-basket" onSubmit={this.onSubmit}>
        <div className="add-product">
          <div className="add-product-name">{p.name}</div> ${p.price}
          <div className="add-product-modifiers">
            {p.modifiers.map((cId) => {
              const c = data.categoriesById[cId];

              return (
                <div key={cId} className="add-modifier-group">
                  <div className="add-modifier-group-name">{c.name}</div>
                  <div>
                    {c.items.map((pId) => {
                      const p = data.productsById[pId];

                      return (
                        <div key={pId} className="add-modifier">
                          <label>
                            <input
                              type={c.multiselect ? "checkbox" : "radio"}
                              required={!c.multiselect}
                              name={`mod-${cId}`}
                              checked={
                                (modifiers[cId] && modifiers[cId][pId]) || false
                              }
                              onChange={(e) => this.toggleModifier(e, cId, pId)}
                            />{" "}
                            {p.name}{" "}
                            {p.price !== 0 && (
                              <span className="add-modifier-price">
                                ${p.price}
                              </span>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <button type="button" onClick={this.dec} disabled={qty <= 1}>
            -
          </button>
          &nbsp;
          {qty}
          &nbsp;
          <button type="button" onClick={this.inc}>
            +
          </button>
          &nbsp; ${(totalProductPrice * qty).toFixed(2)}
          <br />
          <br />
          <button type="submit">Add</button>
        </div>
      </form>
    );
  }
}
