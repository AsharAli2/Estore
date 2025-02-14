import { createContext, useState } from "react";

const cartcontext = createContext({});

export const CartContainer = ({ children }) => {
  const [cartitem, setcartitem] = useState([]);
  const addtoCart = (newitem) => {
    const ProductExist = cartitem.find((prod) => {
      return prod.name === newitem.name;
    });
    if (ProductExist) {
      return;
    }
    const items = [...cartitem, newitem];
    setcartitem(items);
  };
  const removecart = (removeitem) => {
    const filtercart = cartitem.filter((item) => {
      return item.name !== removeitem;
    });
    setcartitem(filtercart);
  };
  const updateCartQuantity = (name, newQuantity) => {
    setcartitem((prevCart) =>
      prevCart.map((item) =>
        item.name === name ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <cartcontext.Provider
      value={{ cartitem, addtoCart, removecart, setcartitem }}
    >
      {children}
    </cartcontext.Provider>
  );
};
export default cartcontext;
