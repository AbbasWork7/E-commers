import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Image, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductDetail = ({ theme }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);

  const staticProducts = [
    {
      id: 1,
      name: "Nike Air Max 270",
      price: 129.99,
      description: "Classic comfort meets modern design.",
      image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-V4DfZQ.png",
      category: "Shoes",
      details: {
        brand: "Nike",
        color: "Black/White",
        material: "Mesh and synthetic materials",
        features: [
          "Responsive Air Max cushioning",
          "Breathable mesh upper",
          "Durable rubber outsole",
          "Padded collar for comfort"
        ],
        sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      }
    }
  ];

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5004/api/pr/${productId}`, {
          signal: controller.signal
        });
        const result = response.data;
        if (result) {
          setProduct(result);
          setError(null);

          // Fetch related products by category
          fetchRelatedProducts(result.category, result.id);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          const fallback = staticProducts.find(p => p.id === parseInt(productId));
          if (fallback) {
            setProduct(fallback);
            setError(null);
          } else {
            setError("Product not found");
            setProduct(null);
          }
        }
      }

      return () => controller.abort();
    };

    fetchProduct();
  }, [productId]);

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const res = await axios.get(`http://localhost:5004/api/related-products?category=${category}&excludeId=${currentProductId}`);
      setRelatedProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch related products", err.message);
    }
  };

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const imageStyle = {
    width: '100%',
    height: '400px',
    objectFit: 'contain',
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f8f9fa',
    borderRadius: '8px',
    padding: '1rem',
  };

  const buttonStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#90caf9',
    borderColor: theme === 'dark' ? '#333' : '#64b5f6',
    color: theme === 'dark' ? '#fff' : '#2c3e50',
  };

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h2 className={theme === 'dark' ? 'text-light' : ''}>{error}</h2>
        <Button onClick={() => navigate('/products')} variant="primary" className="mt-3">Back to Products</Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2 className={theme === 'dark' ? 'text-light' : ''}>Loading...</h2>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const sizes = product.variants?.[0]?.option2 || [];

  return (
    <Container className="py-4">
      <Button
        variant="outline-primary"
        onClick={() => navigate('/products')}
        className="mb-4"
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back to Products
      </Button>

      <div style={containerStyle}>
        <Row>
          <Col md={6}>
            <Image
              src={product.images?.[0] || 'https://via.placeholder.com/400'}
              alt={product.name}
              style={imageStyle}
              fluid
            />
          </Col>
          <Col md={6}>
            <h2 className={`mb-3 ${theme === 'dark' ? 'text-light' : ''}`}>{product.name}</h2>
            <h3 className="text-primary mb-4">₹{product.price}</h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
              {product.description?.trim() || product.full_description}
            </p>

            <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
              <Card.Body>
                <h5 className="mb-3">Product Details</h5>
                <Row><Col xs={4}>SKU:</Col><Col>{product.sku}</Col></Row>
                <Row className="mt-2"><Col xs={4}>Category:</Col><Col>{product.category}</Col></Row>
                <Row className="mt-2"><Col xs={4}>Stock:</Col><Col>{product.track_inventory ? `${product.quantity} available` : 'Not Tracked'}</Col></Row>
              </Card.Body>
            </Card>

            {sizes.length > 0 && (
              <div className="mb-4">
                <h5 className={theme === 'dark' ? 'text-light' : ''}>Available Sizes</h5>
                <div className="d-flex gap-2 flex-wrap">
                  {sizes.map(size => (
                    <Button key={size} variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} className="px-3 py-2">
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.seo_keywords && (
              <div className="mb-4">
                <h5 className={theme === 'dark' ? 'text-light' : ''}>Highlights</h5>
                <ul className={theme === 'dark' ? 'text-light' : ''}>
                  {product.seo_keywords.split(',').map((word, index) => (
                    <li key={index}>{word.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="d-grid gap-2">
              <Button size="lg" style={buttonStyle} onClick={() => addToCart(product)}>
                Add to Cart
              </Button>
              <Button
                variant={isInWishlist(product.id) ? "danger" : theme === 'dark' ? 'outline-light' : 'outline-dark'}
                size="lg"
                onClick={() => addToWishlist(product)}
              >
                {isInWishlist(product.id) ? (
                  <>
                    <i className="bi bi-heart-fill me-2"></i> Remove from Wishlist
                  </>
                ) : (
                  <>
                    <i className="bi bi-heart me-2"></i> Add to Wishlist
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h4 className={theme === 'dark' ? 'text-light' : ''}>Related Products</h4>
          <Row className="mt-3">
            {relatedProducts.map(item => (
              <Col md={3} key={item.id} className="mb-4">
                <Card className={theme === 'dark' ? 'bg-dark text-light' : ''} onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <Card.Img variant="top" src={item.images?.[0] || 'https://via.placeholder.com/150'} style={{ height: '200px', objectFit: 'contain' }} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>₹{item.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default ProductDetail;
