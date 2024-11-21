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
