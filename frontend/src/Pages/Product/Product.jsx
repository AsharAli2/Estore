import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import {
  Container,
  Button,
  Typography,
  Grid,
  Box,
  TextField,
  Divider,
  Paper,
  Chip,
  Stack,
  Card,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import cartcontext from "../../context/Cartcontext";
import { API_URL } from "../../../utils/constant";
import Loading from "../../Components/Loading/Loading";

export default function Product() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [SingleProduct, setSingleProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const Cartcontext = useContext(cartcontext);
  const { addtoCart } = Cartcontext;

  let { id } = useParams();
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    fetchSingleProduct();
    fetchReviews();
    const isUser = localStorage.getItem("user");
    if (isUser) {
      setUser(JSON.parse(isUser));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSingleProduct = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    // strip embeddings returned by the API before storing in state
    if (data && data.product) {
      const rest = { ...data.product };
      if (rest.Embeddings) delete rest.Embeddings;
      setSingleProduct(rest);
    } else {
      setSingleProduct(data.product || {});
    }
    setLoading(false);
  };

  // Generate image gallery: if product has single image, create mock thumbnails for demo
  const getImageGallery = () => {
    if (!SingleProduct.image) return [];
    // For now, assume single image; in future, extend to array if API supports it
    // Mock additional angles/views for demo
    return [SingleProduct.image, SingleProduct.image, SingleProduct.image, SingleProduct.image];
  };

  const images = getImageGallery();
  const mainImage = images[selectedImage] || SingleProduct.image || '';

  const fetchReviews = async () => {
    const response = await fetch(`${API_URL}/products/review/${id}`);
    const data = await response.json();
    setReviews(data.reviews || []);
  };

  const userHasReviewed = reviews.some(
    (review) => review.userName === user?.userName
  );

  const handleReviewSubmit = async () => {
    if (newReview.trim() && rating > 0) {
      const response = await fetch(`${API_URL}/products/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review: newReview,
          rating: rating,
          userName: user?.userName || "Anonymous",
        }),
      });
      const data = await response.json();
      setReviews([...reviews, data.newReview]);
      setNewReview("");
      setRating(0);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Loading open={checkingAuth || addingToCart} text={checkingAuth ? "Checking login..." : "Adding to cart..."} />

      {loading ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={500} />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={80} />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="60%" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      ) : (
        <>
          {/* Product Section */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Image Gallery */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                {/* Main Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    mb: 2,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={mainImage}
                    alt={SingleProduct.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                {/* Thumbnail Gallery */}
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImage === idx ? '2px solid #3498db' : '2px solid #ddd',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#3498db',
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        style={{
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { xs: 0, md: 2 } }}>
                {/* Category Badge */}
                <Chip
                  label={SingleProduct.Category || 'Product'}
                  variant="outlined"
                  sx={{ mb: 2, borderColor: '#3498db', color: '#3498db' }}
                />

                {/* Title */}
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
                  {SingleProduct.name}
                </Typography>

                {/* Rating & Reviews */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={SingleProduct.averageRating || 0} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({SingleProduct.ratingCount || 0} reviews)
                  </Typography>
                </Box>

                {/* Brand */}
                {SingleProduct.Brand && (
                  <Typography variant="body2" sx={{ mb: 2, color: '#7f8c8d' }}>
                    <strong>Brand:</strong> {SingleProduct.Brand}
                  </Typography>
                )}

                {/* Price */}
                <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #ecf0f1' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#3498db', mb: 1 }}>
                    Rs. {SingleProduct.price}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ✓ In Stock
                  </Typography>
                </Box>

                {/* Description */}
                <Typography variant="body1" sx={{ mb: 3, color: '#34495e', lineHeight: 1.7 }}>
                  {SingleProduct.description}
                </Typography>

                {/* Quantity & Add to Cart */}
                <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, mb: 3 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        fullWidth
                        disabled={addingToCart || checkingAuth}
                        onClick={async () => {
                          setCheckingAuth(true);
                          const isUser = localStorage.getItem('user');
                          await new Promise((r) => setTimeout(r, 200));
                          if (!isUser) {
                            setCheckingAuth(false);
                            navigate('/Login');
                            return;
                          }
                          setCheckingAuth(false);
                          setAddingToCart(true);
                          setTimeout(() => {
                            addtoCart(SingleProduct);
                            setAddingToCart(false);
                          }, 300);
                        }}
                        sx={{
                          py: 1.5,
                          backgroundColor: '#3498db',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#2980b9' },
                        }}
                      >
                        {addingToCart || checkingAuth ? 'Adding...' : 'Add to Cart'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<FavoriteBorderIcon />}
                        sx={{
                          py: 1.5,
                          borderColor: '#ddd',
                          color: '#7f8c8d',
                          textTransform: 'none',
                        }}
                      >
                        Wishlist
                      </Button>
                    </Box>
                  </Stack>
                </Paper>

                {/* Product Info Cards */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Delivery
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                        Free Shipping
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Returns
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                        30 Days Easy
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Reviews Section */}
          <Box sx={{ my: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#2c3e50' }}>
              Customer Reviews & Ratings
            </Typography>

            {/* Review Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#3498db' }}>
                    {SingleProduct.averageRating?.toFixed(1) || '—'}
                  </Typography>
                  <Rating value={SingleProduct.averageRating || 0} readOnly size="small" sx={{ mt: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    {SingleProduct.ratingCount || 0} ratings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#34495e' }}>
                    Be the first to review this product and help others make an informed decision.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Write Review Form */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                {userHasReviewed ? '✓ Your Review Submitted' : 'Share Your Experience'}
              </Typography>
              <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Your Rating
                    </Typography>
                    <Rating
                      value={rating}
                      onChange={(event, newValue) => setRating(newValue)}
                      disabled={userHasReviewed}
                      size="large"
                    />
                  </Box>
                  <TextField
                    label="Your Review"
                    placeholder="Share your thoughts about this product..."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    disabled={userHasReviewed}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleReviewSubmit}
                    disabled={userHasReviewed || rating === 0 || newReview.length === 0}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#3498db',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#2980b9' },
                    }}
                  >
                    {userHasReviewed ? 'Review Already Submitted' : 'Submit Review'}
                  </Button>
                </Stack>
              </Paper>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Display Reviews */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </Typography>
              {reviews.length > 0 ? (
                <Stack spacing={2}>
                  {reviews.map((review, index) => (
                    <Card key={index} sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {review.userName || 'Anonymous'}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#34495e', lineHeight: 1.6 }}>
                        {`"${review.review}"`}
                      </Typography>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="body2" color="text.secondary">
                    No reviews yet. Be the first to share your experience!
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}

