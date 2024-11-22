# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
<hr />

### Mini-Project: E-com Application with Typescript Project

 **Authenticating a User before allowing them access to our application** 

### AuthenticationGuard Component Example: 

```
import { withAuthenticationRequired } from '@auth0/auth0-react'
import React, { ComponentType } from 'react'

interface AuthenticationProps {
    childComponent: ComponentType<object>
}

const AuthenticationGuard = ({childComponent}: AuthenticationProps) => {

    // ProtectedComponent - makes use of withAuthenticationRequired (auth0's route protection)
    // if we are logged in/successfully authenticated then redirect them to the childComponent (first argument we pass in) 
    // if we are not, redirected to the login page 
    // ensures we can only access the page if we are logged in
    const ProtectedComponent = withAuthenticationRequired(childComponent, {onRedirecting: () => <>Loading...</>})

  return (
    <div>
      <ProtectedComponent />
    </div>
  )
}

export default AuthenticationGuard

```
**If User logs in Display their picture, name, and email**

### Profile Display Component Example: 
```
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
    )
  );
};

export default Profile;

```


### Profile Page Component Example:

```
import React from 'react'
import Profile from './Profile'
import { Container } from 'react-bootstrap'

const ProfilePage = () => {
  return (
    <Container>
    <Profile />
    </Container>
  )
}

export default ProfilePage

```
**Auth0 Hook, Conditional Rendering Based on Authentication.**

### Navbar Component Example:

```
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Container, Navbar, Nav, Badge } from "react-bootstrap";
import LoginButton from "./LoginButton";
import LogoutButton from "./Logout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const NavBar: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          E-Commerce App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart <Badge pill bg="primary">{totalItems}</Badge>
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Navbar.Text className='mx-4'>
                  Signed in as: <a href="/profile">{user?.name}</a>
                </Navbar.Text>
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

```
### Login Button Component Example:

```
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;

```
### Logout Component Example:

```
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </button>
  );
};

export default LogoutButton;

```

### Home Component Example:

```
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Product } from '../interfaces/Products';
import { useDispatch } from 'react-redux';
import { addItem } from '../features/cartSlice';
import SuccessModal from './SuccessModal';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addItem(product));
    setShowSuccessModal(true);
  };

  return (
    <Container>
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={4} className="mb-3">
            <Card>
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>${product.price}</Card.Text>
                <Button variant="primary" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
                <Link to={`/product/${product.id}`}>
                  <Button variant="secondary" className="ml-2">
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <SuccessModal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} />
    </Container>
  );
};

export default Home;

```
### Product Details Component Example:

```
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Button } from 'react-bootstrap';
import { Product } from '../interfaces/Products';
import { useDispatch } from 'react-redux';
import { addItem } from '../features/cartSlice';
import SuccessModal from './SuccessModal';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (product: Product) => {
    dispatch(addItem(product));
    setShowSuccessModal(true);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-5">
      <Card>
        <Card.Img variant="top" src={product.image} />
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text><strong>Category:</strong> {product.category}</Card.Text>
          <Card.Text><strong>Price:</strong> ${product.price}</Card.Text>
          <Card.Text>
            <strong>Rating:</strong> {product.rating.rate} ({product.rating.count} reviews)
          </Card.Text>
          <Button variant="primary" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
        </Card.Body>
      </Card>
      <SuccessModal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} />
    </Container>
  );
};

export default ProductDetails;

```

### Product Interface Example:

```
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

```
### CartItem Interface  Example:

```
export interface CartItem {
    product: Product,
    quantity: number
}

```

### Cart Component Example: 

```
import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { deleteItem, checkout, addItem } from '../features/cartSlice';
import SuccessModal from './SuccessModal';
import WarningModal from './WarningModal';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cart);
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);
  const totalPrice = useSelector((state: RootState) => state.cart.totalPrice);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const submitOrder = () => {
    setOrderComplete(true);
    setShowCheckout(false);
    dispatch(checkout());
    alert('Order placed successfully!');
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addItem(product));
    setShowSuccessModal(true);
  };

  const handleRemoveItem = (id: number) => {
    setItemToRemove(id);
    setShowWarningModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove !== null) {
      dispatch(deleteItem(itemToRemove));
    }
    setShowWarningModal(false);
  };

  return (
    <Container className="my-5">
      <h2>Shopping Cart</h2>
      <ListGroup>
        {cartItems.map((item) => (
          <ListGroup.Item key={item.product.id}>
            <Row>
              <Col md={6}>{item.product.title}</Col>
              <Col md={2}>${item.product.price}</Col>
              <Col md={2}>Qty: {item.quantity}</Col>
              <Col md={2}>
                <Button variant="danger" onClick={() => handleRemoveItem(item.product.id)}>
                  Remove
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="mt-3">
        <h4>Total Items: {totalItems}</h4>
        <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
      </div>
      <Button variant="primary" className="mt-3" onClick={handleCheckout}>
        Proceed to Checkout
      </Button>

      {showCheckout && (
        <Form className="mt-4">
          <h3>Checkout</h3>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAddress" className="mt-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" className="mt-3" onClick={submitOrder}>
            Place Order
          </Button>
        </Form>
      )}
      {orderComplete && (
        <div className="mt-3">
          <h4>Thank you for your order!</h4>
          <p>Your items will be shipped to:</p>
          <p><strong>{name}</strong></p>
          <p>{address}</p>
        </div>
      )}
      <SuccessModal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} />
      <WarningModal show={showWarningModal} onHide={() => setShowWarningModal(false)} onConfirm={confirmRemoveItem} />
    </Container>
  );
};

export default Cart;

```
### Success Modal Component Example:

```
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface SuccessModalProps {
  show: boolean;
  onHide: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Item added to cart successfully!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;

```
### Warning Modal Component Example:

```
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface WarningModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to remove this item from the cart?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal;

```

### cartSlice features Example: 

```
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

```
### store Example: 

```
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```
### CartContext Component Example: 

```
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '../interfaces/CartItem';
import { Product } from '../interfaces/Products';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  showSuccessModal: boolean;
  closeSuccessModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setShowSuccessModal(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, showSuccessModal, closeSuccessModal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

```
### Checkout Component Example:

```
import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Container, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleCheckout = () => {
    alert('Order placed successfully!');
    clearCart();
  };

  return (
    <Container className="my-5">
      <h2>Checkout</h2>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formAddress" className="mt-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>
      </Form>
      <h3 className="mt-4">Order Summary</h3>
      <ListGroup>
        {cart.map((item) => (
          <ListGroup.Item key={item.product.id}>
            <Row>
              <Col md={6}>{item.product.title}</Col>
              <Col md={2}>${item.product.price}</Col>
              <Col md={2}>Qty: {item.quantity}</Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button variant="primary" className="mt-3" onClick={handleCheckout}>
        Place Order
      </Button>
    </Container>
  );
};

export default Checkout;

```
