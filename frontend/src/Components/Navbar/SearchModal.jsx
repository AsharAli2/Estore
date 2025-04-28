import { Box, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../../utils/constant";

const style = {
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translate(-50%)",
  width: "50%",
  borderRadius: "12px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function SearchModal({ open, setOpen }) {
  const navigate = useNavigate();
  const [Product, setProduct] = useState([]);
  const [search, setsearch] = useState("");

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_URL}/products/allproducts`);
      const data = await response.json();
      setProduct(data.Product);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  function handleSelectProduct(item) {
    setsearch(item.name);
    navigate(`/Product/${item._id}`);
    setOpen(false);
  }

  // Filtered products based on search query
  const filteredProducts = Product.filter((item) =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Search Input */}
        <TextField
          sx={{ width: "100%" }}
          label="Search for Products"
          variant="outlined"
          value={search}
          onChange={(ev) => setsearch(ev.target.value)}
        />

        {/* Search Results */}
        {search.length > 0 && (
          <Box
            sx={{
              width: "100%",
              mt: 2,
              maxHeight: "300px",
              overflowY: "auto",
              borderRadius: "8px",
              border: "1px solid #ddd",
              bgcolor: "#f9f9f9",
            }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "#e0f7fa",
                    },
                  }}
                  onClick={() => handleSelectProduct(item)}
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  {/* Product Name */}
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
              ))
            ) : (
              // No results message
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "gray",
                  padding: "20px",
                }}
              >
                No products found
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
