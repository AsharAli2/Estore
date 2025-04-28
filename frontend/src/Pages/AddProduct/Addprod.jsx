import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Alert, Container, MenuItem, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import "./addprod.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constant";
export default function Addprod() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [description, setdescription] = useState("");
  const [image, setimage] = useState("");
  const [brand, setbrand] = useState("");
  const [category, setcategory] = useState("");
  const [quantity, setquantity] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));

  const handleChange = (event) => {
    setcategory(event.target.value);
  };
  const textchange = (ev) => {
    const { value, name } = ev.target;
    if (name == "name") {
      setname(value);
    }
    if (name == "Price") {
      setprice(value);
    }
    if (name == "Image") {
      setimage(value);
    }
    if (name == "Brand") {
      setbrand(value);
    }
    if (name == "Description") {
      setdescription(value);
    }
    if (name == "Quantity") {
      setquantity(value);
    }
  };

  const submit = async () => {
    const productdata = {
      name,
      price: +price,
      image,
      description,
      brand,
      quantity: +quantity,
      category,
    };
    const response = await fetch(`${API_URL}/products/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productdata),
    });
    setTimeout(() => {
      navigate("/Admin/Products");
    }, 2000);
    setState({ vertical: "bottom", horizontal: "center", open: true });
  };

  const handleClose = (event, reason) => {
    setState({ open: false, vertical: "top", horizontal: "center" });
  };
  return (
    <>
      <Container
        className="Container"
        sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <h2>Add Product</h2>

        <TextField
          fullWidth
          value={name}
          name="name"
          onChange={textchange}
          id="outlined-basic"
          label="Product Name"
          variant="outlined"
        />

        <TextField
          fullWidth
          name="Price"
          onChange={textchange}
          value={price}
          id="outlined-basic"
          label="Price"
          variant="outlined"
        />
        <TextField
          fullWidth
          name="Category"
          select
          label="Category"
          value={category}
          onChange={handleChange}
          id="outlined-basic"
          variant="outlined"
        >
          <MenuItem value="Headphones">Headphones</MenuItem>
          <MenuItem value="Laptops">Laptops</MenuItem>
          <MenuItem value="Phone">Phone</MenuItem>
          <MenuItem value="Camera">Camera</MenuItem>
          <MenuItem value="Monitors">Moniors</MenuItem>
          <MenuItem value="Combo">Combo</MenuItem>
        </TextField>
        <TextField
          fullWidth
          name="Brand"
          onChange={textchange}
          label="Brand"
          id="outlined-basic"
          variant="outlined"
        />
        <TextField
          fullWidth
          name="Quantity"
          onChange={textchange}
          label="Quantity"
          id="outlined-basic"
          variant="outlined"
        />
        <TextField
          fullWidth
          name="Image"
          onChange={textchange}
          label="Image"
          id="outlined-basic"
          variant="outlined"
        />
        <TextField
          fullWidth
          onChange={textchange}
          name="Description"
          value={description}
          multiline
          rows={4}
          id="outlined-basic"
          label="Description"
          variant="outlined"
        />
        {category && name && image && description && brand && price && (
          <Button fullWidth onClick={submit} variant="contained">
            Add Product
          </Button>
        )}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={2000}
          key={vertical + horizontal}
          onClose={handleClose}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            Product added
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
