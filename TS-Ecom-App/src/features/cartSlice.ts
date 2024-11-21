import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/CartItem';
import { Product } from '../interfaces/Products';

interface CartState {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const item = action.payload;
      const existingItem = state.cart.find(cartItem => cartItem.product.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ product: item, quantity: 1 });
      }
      state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const itemToDelete = state.cart.find(cartItem => cartItem.product.id === id);
      if (itemToDelete) {
        state.totalPrice -= itemToDelete.product.price * itemToDelete.quantity;
        state.cart = state.cart.filter(cartItem => cartItem.product.id !== id);
        state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    checkout: (state) => {
      state.cart = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    }
  }
});

export const { addItem, deleteItem, checkout } = cartSlice.actions;
export default cartSlice.reducer;
