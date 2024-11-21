import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SuccessModal from './components/SuccessModal';
import { Provider } from 'react-redux';
import { store } from './store';
import { CartProvider } from './components/CartContext';
import AuthenticationGuard from './components/AuthenticationGuard';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CartProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<AuthenticationGuard childComponent={Home}/>} />
            <Route path="/profile" element={<AuthenticationGuard childComponent={ProfilePage} />}/>
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <SuccessModal show={false} onHide={function (): void {
            throw new Error('Function not implemented.');
          } } />
        </BrowserRouter>
      </CartProvider>
    </Provider>
  );
};

export default App;
