import React, { useContext, useReducer, createContext, useEffect } from "react";
import cartItems from "./data"; // Import your local data
import reducer from "./reducer";

const AppContext = createContext();

const initialState = {
  loading: false, // No need to handle loading if data is local
  cart: cartItems, // Use the local data directly
  total: 0,
  amount: 0,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const remove = (id) => {
    dispatch({ type: "REMOVE", payload: id });
  };

  const increase = (id) => {
    dispatch({ type: "INCREASE", payload: id });
  };

  const decrease = (id) => {
    dispatch({ type: "DECREASE", payload: id });
  };

  const toggleAmount = (id, type) => {
    dispatch({ type: "TOGGLE_AMOUNT", payload: { id, type } });
  };

  useEffect(() => {
    const total = state.cart.reduce((acc, item) => {
      let price = item.price;

      // If the price is a string, remove commas and convert to a number
      if (typeof price === "string") {
        price = parseFloat(price.replace(/,/g, ""));
      }

      // Log values to debug
      console.log(
        `Item: ${item.title}, Price: ${price}, Amount: ${item.amount}`
      );

      // Return the accumulated total
      return acc + price * item.amount;
    }, 0);

    console.log(`Total: ${total}`);

    dispatch({
      type: "GET_TOTALS",
      payload: { total },
    });
  }, [state.cart]);

  return (
    <AppContext.Provider
      value={{ ...state, clearCart, remove, increase, decrease, toggleAmount }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext };
