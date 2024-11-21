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
