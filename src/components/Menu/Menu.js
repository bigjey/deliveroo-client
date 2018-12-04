import "./Menu.css";

import React from "react";

export const Menu = ({ data, onItemClick }) => (
  <div className="m-container">
    {data.categories.map((cId) => {
      const c = data.categoriesById[cId];
      return (
        <div className="m-category" key={cId}>
          <div className="m-category-title">{c.name}</div>

          <div className="m-category-items">
            {c.items.map((pId) => {
              const p = data.productsById[pId];

              return (
                <div
                  key={pId}
                  className="m-item"
                  onClick={() => onItemClick(pId)}
                >
                  {p.name} ${p.price}
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);
