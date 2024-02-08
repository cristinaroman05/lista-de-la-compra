import React from "react";
import "../ShoppingList/ShoppingList.css";
const initialValue = {
  Products: [
    {
      id: 0,
      aliment: "",
      price: "",
    },
  ],
  lastProductCreated: 0,
};

const reducer = (state, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "Create Product":
      const newProduct = {
        id: state.lastProductCreated + 1,
        aliment: action.payload.aliment,
        price: action.payload.price,
      };
      newState.Products = [...newState.Products, newProduct];
      newState.lastProductCreated = newProduct.id;
      break;
    case "Delete Product":
      newState.Products = newState.Products.filter(
        (Product) => Product.id !== action.payload.id
      );
      break;
    default:
      console.error("Action type not supported");
  }
  return newState;
};

const ShoppingList = () => {
  const [state, dispatch] = React.useReducer(reducer, initialValue);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const inputReference = React.useRef(null);
  const inputPrice = React.useRef(null);

  const onSubmit = React.useCallback((event) => {
    event.preventDefault();
    const payload = {
      aliment: inputReference.current.value,
      price: inputPrice.current.value,
    };
    dispatch({ type: "Create Product", payload: payload });
    inputReference.current.value = "";
    inputPrice.current.value = "";
  }, []);

  const deleteProduct = React.useCallback((ProductId) => {
    const payload = {
      id: ProductId,
    };
    dispatch({ type: "Delete Product", payload: payload });
    setTotalPrice((total) => total - payload.price);
  }, []);
  React.useEffect(() =>{
    const total = state.Products.reduce((acc, curr)=> acc + parseFloat (curr.price), 0);
    setTotalPrice(total)
  },[state.Products])

  return (
    <div>
      <h2>Carrito:</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Nombre del producto"
          ref={inputReference}
          type="text"
          required
        ></input>
        <input
          placeholder="Precio del producto"
          ref={inputPrice}
          type="number"
          required
        ></input>
        <button type="submit">Añadir Producto</button>
      </form>
      <h2>Productos:</h2>
      <ul>
        {state.Products.map((Product) => (
          <li key={Product.id}>
            {Product.aliment}/Precio:{Product.price}
            <button onClick={() => deleteProduct(Product.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <h2>Total: {totalPrice}€</h2>
    </div>
  );
};

export default ShoppingList;
