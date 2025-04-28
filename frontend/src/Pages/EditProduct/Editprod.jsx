import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Alert, Container, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editprod.css";
import { API_URL } from "../../../utils/constant";
export default function Editprod() {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [SingleProduct, setSingleProduct] = useState({});
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  let { id } = useParams();
  const token = JSON.parse(localStorage.getItem("token"));
  const [mess, setmess] = useState(false);

  const fetchsingleproduct = async () => {
    setLoading(true);

    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();

    setSingleProduct(data.product);
    setLoading(false);
  };

  const textchange = (ev) => {
    const { value, name } = ev.target;
    setSingleProduct(() => {
      return {
        ...SingleProduct,
        [name]: value,
      };
    });
  };

  const submit = async () => {
    const productdata = { ...SingleProduct };
    const response = await fetch(`${API_URL}/products/edit/${id}`, {
      method: "PUT",
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

  useEffect(() => {
    fetchsingleproduct();
  }, []);
  const handleClose = (event, reason) => {
    setState({ open: false, vertical: "top", horizontal: "center" });
  };
  return (
    <>
      <Container
        className="Container"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1 style={{ fontFamily: "monospace", fontSize: "40px" }}>
          Edit Product
        </h1>

        <TextField
          fullWidth
          value={SingleProduct.name}
          name="name"
          onChange={textchange}
          variant="outlined"
        />

        <TextField
          fullWidth
          name="price"
          onChange={textchange}
          value={SingleProduct.price}
          variant="outlined"
        />
        <TextField
          fullWidth
          name="image"
          onChange={textchange}
          value={SingleProduct.image}
          variant="outlined"
        />
        <TextField
          fullWidth
          onChange={textchange}
          name="description"
          value={SingleProduct.description}
          multiline
          rows={4}
          variant="outlined"
        />
        <Button fullWidth onClick={submit} variant="contained">
          Edit Product
        </Button>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={2000}
          key={vertical + horizontal}
          onClose={handleClose}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            Product edited
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
