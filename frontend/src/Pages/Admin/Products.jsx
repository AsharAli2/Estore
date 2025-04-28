import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Admin from "./Admin";
import { useNavigate } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DataGrid } from "@mui/x-data-grid";
import { API_URL } from "../../../utils/constant";

export default function Products() {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));

  const [Products, setProducts] = useState([]);

  // DELETE PRODUCT
  const handledelete = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const productsfilter = Products.filter((name) => name._id !== id);
    setProducts(productsfilter);
  };

  // FETCH ALL PRODUCTS
  async function products() {
    const response = await fetch(`${API_URL}/Dashboard/Products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setProducts(data.allProducts);
  }

  useEffect(() => {
    products();
  }, []);

  // GRID DATA
  const columns = [
    {
      field: "Image",
      headerClassName: "super-app-theme--header",
      headerName: "Image",
      width: 160,
      renderCell: (params) => {
        return (
          <img
            src={params.value}
            alt=""
            style={{ height: "100px", width: "100px" }}
          />
        );
      },
    },
    {
      field: "Name",
      headerClassName: "super-app-theme--header",
      headerName: "Name",
      width: 340,
    },
    {
      field: "Category",
      headerClassName: "super-app-theme--header",
      headerName: "Category",
      width: 180,
    },
    {
      field: "Quantity",
      headerClassName: "super-app-theme--header",
      headerName: "Quantity",
      width: 160,
    },
    {
      field: "Edit",
      headerClassName: "super-app-theme--header",
      headerName: "Edit",
      width: 120,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => navigate(`/Product/edit/${params.value}`)}>
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
        );
      },
    },
    {
      field: "Delete",
      headerClassName: "super-app-theme--header",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handledelete(params.value)}>
            <DeleteOutlineIcon sx={{ fontSize: 30 }} />
          </IconButton>
        );
      },
    },
  ];

  const rows = Products.map((item, index) => {
    return {
      id: index,
      Image: item.image,
      Name: item.name,
      Category: item.Category,
      Quantity: item.quantity,
      Edit: item._id,
      Delete: item._id,
    };
  });
  // GRID DATA END

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ height: "100%", width: "100%", margin: "0px" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          sx={{
            padding: "0px !important",
            textAlign: "center",
            height: { xs: "auto", sm: "auto", md: "100vh" },
            position: { md: "sticky" },
            top: { md: "0" },
            backgroundColor: "#101A32",
          }}
        >
          <Admin />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "0px !important",
          }}
        >
          <Typography variant="h4">Products Management</Typography>

          <Box
            sx={{
              height: "80vh",
              width: "95%",
              "& .super-app-theme--header": {
                backgroundColor: "#F4F6F8",
                color: "black",
                fontSize: "15px",
              },
            }}
          >
            <div
              style={{
                color: "blue",
                border: "1px solid lightgrey",
                borderBottom: "none",
                height: "40px",
                display: "flex",
                alignItems: "center",
                fontFamily: "sans-serif",
                fontSize: "larger",
                paddingLeft: "10px",
              }}
            >
              <Button onClick={() => navigate("/addproduct")}>
                + Add Product
              </Button>
            </div>

            <DataGrid
              rows={rows}
              rowHeight={100}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 9,
                  },
                },
              }}
              pageSizeOptions={[9]}
              disableRowSelectionOnClick
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
