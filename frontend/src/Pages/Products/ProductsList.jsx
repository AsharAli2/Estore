import { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Drawer,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Pagination,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Skeleton,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  CardActions,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { fetchProducts } from "../../utils/api";
import cartcontext from "../../context/Cartcontext";
import Loading from "../../Components/Loading/Loading";

export default function ProductsList() {
  const { name } = useParams();
  const navigate = useNavigate();
  const CartContext = useContext(cartcontext);
  const { addtoCart } = CartContext;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [category, setCategory] = useState(name || "");
  const [sort, setSort] = useState("");

  useEffect(() => {
    if (name) setCategory(name);
  }, [name]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts({
        page,
        pagesize: pageSize,
        category,
        search,
        sort,
      });
      // flexible response handling: support multiple shapes
      const items = data.products || data.Product || data.items || [];
      setProducts(items);
      const count = data.count || data.total || data.totalCount || items.length;
      setTotalCount(count);

      // derive available brands from response
      const uniqueBrands = [
        ...new Set(items.map((p) => p.Brand).filter(Boolean)),
      ];
      setBrands(uniqueBrands);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, search, sort]);

  const handlePageChange = (e, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = useMemo(
    () => Math.max(1, Math.ceil((totalCount || products.length) / pageSize)),
    [totalCount, products]
  );

  const filteredProducts = selectedBrands.length
    ? products.filter((p) => selectedBrands.includes(p.Brand))
    : products;

  const handleAddToCart = async (product) => {
    // show short loader while verifying login
    setCheckingAuth(true);
    await new Promise((r) => setTimeout(r, 200));
    const isUser = localStorage.getItem("user");
    if (!isUser) {
      setCheckingAuth(false);
      navigate("/Login");
      return;
    }
    setCheckingAuth(false);
    setAddingToCart(product._id);
    setTimeout(() => {
      addtoCart(product);
      setAddingToCart(null);
    }, 350);
  };

  return (
    <>
      <Loading
        open={checkingAuth || addingToCart !== null}
        text={checkingAuth ? "Checking login..." : "Adding to cart..."}
      />
      {/* Ecommerce Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%)",
          color: "#2c3e50",
          py: 4,
          mb: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 1, color: "#2c3e50" }}
          >
            Explore Our Products
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.8, mb: 2, color: "#34495e" }}
          >
            Discover thousands of products at great prices
          </Typography>
          <Breadcrumbs sx={{ color: "#7f8c8d" }}>
            <MuiLink
              component="button"
              variant="body2"
              onClick={() => navigate("/")}
              sx={{
                color: "#3498db",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Home
            </MuiLink>
            <Typography sx={{ color: "#34495e" }}>
              {category || "All Products"}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        {/* Filters Bar */}
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            border: "1px solid #ecf0f1",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Search products"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: 240,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              variant="outlined"
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Category"
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All Products</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="Laptops">Laptops</MenuItem>
                <MenuItem value="Headphones">Headphones</MenuItem>
                <MenuItem value="Camera">Camera</MenuItem>
                <MenuItem value="Monitors">Monitors</MenuItem>
              </Select>
            </FormControl>

            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              onClick={() => setFilterOpen(true)}
              sx={{
                textTransform: "none",
                borderColor: "#bdc3c7",
                color: "#34495e",
                "&:hover": {
                  borderColor: "#95a5a6",
                  backgroundColor: "rgba(0,0,0,0.02)",
                },
              }}
            >
              Filters ({selectedBrands.length})
            </Button>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="sort-label">Sort</InputLabel>
              <Select
                labelId="sort-label"
                value={sort}
                label="Sort"
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <Drawer
          anchor="left"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Brands
            </Typography>
            <FormGroup>
              {brands.length === 0 && (
                <Typography variant="body2">No brands available</Typography>
              )}
              {brands.map((b) => (
                <FormControlLabel
                  key={b}
                  control={
                    <Checkbox
                      checked={selectedBrands.includes(b)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedBrands((prev) =>
                          checked ? [...prev, b] : prev.filter((x) => x !== b)
                        );
                      }}
                    />
                  }
                  label={b}
                />
              ))}
            </FormGroup>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setFilterOpen(false);
                  setPage(1);
                }}
              >
                Apply
              </Button>
              <Button
                sx={{ ml: 1 }}
                onClick={() => {
                  setSelectedBrands([]);
                }}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Drawer>

        {filteredProducts.length === 0 && !isLoading && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          {isLoading
            ? Array.from(new Array(10)).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={idx}>
                  <Skeleton variant="rectangular" height={220} />
                  <Skeleton width="80%" sx={{ mt: 1 }} />
                  <Skeleton width="60%" sx={{ mt: 0.5 }} />
                </Grid>
              ))
            : filteredProducts.map((item) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2.4}
                  key={item._id || item.id}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      sx={{
                        height: 180,
                        objectFit: "cover",
                        cursor: "pointer",
                        "&:hover": { opacity: 0.9 },
                      }}
                      onClick={() =>
                        navigate(`/Product/${item._id || item.id}`)
                      }
                    />
                    <Box
                      sx={{
                        p: 1.5,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" },
                          minHeight: "2.4em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                        onClick={() =>
                          navigate(`/Product/${item._id || item.id}`)
                        }
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}
                      >
                        Rs.{item.price}
                      </Typography>
                      {item.averageRating && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          ⭐ {item.averageRating.toFixed(1)} ({item.ratingCount}{" "}
                          reviews)
                        </Typography>
                      )}
                    </Box>
                    <CardActions sx={{ pt: 0 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        fullWidth
                        disabled={addingToCart === item._id}
                        onClick={() => handleAddToCart(item)}
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#3498db",
                          color: "#ffffff",
                          "&:hover": { backgroundColor: "#2980b9" },
                        }}
                      >
                        {addingToCart === item._id ? "Adding..." : "Add"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, totalCount)} of {totalCount} products
          </Typography>
          <Pagination
            count={pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
    </>
  );
}
