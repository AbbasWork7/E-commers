import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';

const Products = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5004/api/pro');
                setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text className={theme === 'dark' ? 'bg-dark border-secondary text-light' : ''}>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={theme === 'dark' ? 'bg-dark border-secondary text-light' : ''}
          />
        </InputGroup>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredProducts.map(product => (
          <Col key={product.id}>
            <ProductCard 
              product={product} 
              theme={theme}
              onAddToWishlist={addToWishlist}
              isInWishlist={isInWishlist(product.id)}
            />
          </Col>
        ))}
      </Row>

      {filteredProducts.length === 0 && (
        <div className={`text-center py-5 ${theme === 'dark' ? 'text-light' : ''}`}>
          <i className="bi bi-search display-1"></i>
          <h3 className="mt-3">No products found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}
    </Container>
  );
};

export default Products;
