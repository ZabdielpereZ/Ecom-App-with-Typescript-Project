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
