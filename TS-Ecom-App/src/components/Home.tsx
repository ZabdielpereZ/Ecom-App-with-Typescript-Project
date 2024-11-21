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
