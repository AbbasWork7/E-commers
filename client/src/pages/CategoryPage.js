import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Modal, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import ProductCard from '../components/ProductCard';

const CategoryPage = ({ theme }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { setMessages } = useChat();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [productToShare, setProductToShare] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5004/api/productscategory/${category}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Fetch friends from localStorage
  useEffect(() => {
    if (user) {
      try {
        const savedFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || '[]');
        const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const friendsWithProfile = savedFriends.map(friend => {
          const userData = allUsers.find(u => u.id === friend.id) || {};
          return {
            id: friend.id,
            name: userData.name || friend.name || 'Unknown User',
            username: userData.username || friend.username || 'unknown',
            profileImage: userData.profileImage || 'https://via.placeholder.com/40'
          };
        });
        setFriends(friendsWithProfile);
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    }
  }, [user]);

  // Handle sharing product
  const handleShareClick = (product) => {
    setProductToShare(product);
    setShowFriendsModal(true);
  };

  const handleShareToFriend = (friend) => {
    if (!user) {
      alert('Please login to share products.');
      return;
    }
    try {
      const shareMessage = {
        id: Date.now(),
        sender: user.id,
        content: productToShare,
        type: 'product',
        timestamp: new Date().toISOString(),
      };

      const chatId = `chat_${Math.min(user.id, friend.id)}_${Math.max(user.id, friend.id)}`;
      const existingMessages = JSON.parse(localStorage.getItem(chatId) || '[]');
      const updatedMessages = [...existingMessages, shareMessage];
      localStorage.setItem(chatId, JSON.stringify(updatedMessages));

      alert(`Product shared with ${friend.name}!`);
      setShowFriendsModal(false);
      setProductToShare(null);
      setFriendSearchTerm('');
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };

  // Filters
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearchTerm.toLowerCase()) ||
    friend.username.toLowerCase().includes(friendSearchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.short_description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priceFilteredProducts = filteredProducts.filter(product => {
    if (priceRange.min && priceRange.max) {
      return product.sale_price >= Number(priceRange.min) && product.sale_price <= Number(priceRange.max);
    }
    if (priceRange.min) {
      return product.sale_price >= Number(priceRange.min);
    }
    if (priceRange.max) {
      return product.sale_price <= Number(priceRange.max);
    }
    return true;
  });

  const sortedProducts = [...priceFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.sale_price - b.sale_price;
      case 'price-high':
        return b.sale_price - a.sale_price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const getCategoryTitle = () => {
    switch (category.toLowerCase()) {
      case 'fashion':
        return 'Fashion';
      case 'electronics':
        return 'Electronics';
      case 'shoes':
        return 'Shoes';
        case 'Watches':
        return 'Watches';
        case 'Furniture':
        return 'Furniture';
        case 'Beauty':
        return 'Beauty';
        case 'Books':
        return 'Books';
      default:
        return 'Products';
    }
  };

  // 👇 Helper to get first image safely
  const getFirstImage = (product) => {
    try {
      if (Array.isArray(product.images)) {
        return product.images[0] || 'https://via.placeholder.com/300';
      }
      const parsedImages = JSON.parse(product.images || '[]');
      return parsedImages[0] || 'https://via.placeholder.com/300';
    } catch (error) {
      return 'https://via.placeholder.com/300';
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : ''}`}>{getCategoryTitle()}</h2>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </Form.Select>
        </Col>
        <Col md={5}>
          <InputGroup>
            <Form.Control
              placeholder="Min price"
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
            <Form.Control
              placeholder="Max price"
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
            <Button variant="outline-secondary" onClick={() => setPriceRange({ min: '', max: '' })}>
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Products List */}
      {loading ? (
  <div className="text-center py-5">Loading...</div>
) : (
  <Row xs={1} sm={2} md={3} className="g-4">
    {sortedProducts.length > 0 ? (
      sortedProducts.map(product => (
        <Col key={product.id}>
          <ProductCard
            product={product}
            theme={theme}
            onAddToWishlist={addToWishlist}
            isInWishlist={isInWishlist(product.id)}
          />
        </Col>
      ))
    ) : (
      <div className="text-center h-100">No products found.</div>
    )}
  </Row>
)}



      {/* Share Modal */}
      <Modal show={showFriendsModal} onHide={() => setShowFriendsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share with a Friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Search friends..."
            value={friendSearchTerm}
            onChange={(e) => setFriendSearchTerm(e.target.value)}
            className="mb-3"
          />
          <ListGroup>
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <ListGroup.Item key={friend.id} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={friend.profileImage}
                      alt={friend.name}
                      width="40"
                      height="40"
                      className="rounded-circle me-2"
                    />
                    <span>{friend.name}</span>
                  </div>
                  <Button variant="link" onClick={() => handleShareToFriend(friend)}>
                    Share
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <div className="text-center py-3">No friends found.</div>
            )}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CategoryPage;
