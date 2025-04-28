import React, { useEffect, useState } from "react";
import Admin from "./Admin";
import { Avatar, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { API_URL } from "../../../utils/constant";

export default function Users() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [Users, setUsers] = useState([]);

  // FETCHING ALL USERS
  async function users() {
    const response = await fetch(`${API_URL}/Dashboard/Users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setUsers(data.allUsers);
  }

  useEffect(() => {
    users();
  }, []);

  // GRID DATA
  const columns = [
    {
      field: "Avatar",
      headerClassName: "super-app-theme--header",
      headerName: "Avatar",
      width: 160,
      renderCell: (params) => {
        const randomHue = Math.floor(Math.random() * 360); // Random hue value between 0 and 360
        const randomLightness = Math.floor(Math.random() * 25 + 20); // Random lightness value between 70 and 95 for light colors
        const backgroundColor = `hsl(${randomHue}, 100%, ${randomLightness}%)`;

        return (
          <Avatar style={{ backgroundColor, marginTop: "6px" }}>
            {params.value}
          </Avatar>
        );
      },
    },
    {
      field: "UserName",
      headerClassName: "super-app-theme--header",
      headerName: "UserName",
      width: 280,
    },
    {
      field: "Email",
      headerClassName: "super-app-theme--header",
      headerName: "Email",
      width: 280,
    },
    {
      field: "Address",
      headerClassName: "super-app-theme--header",
      headerName: "Address",
      width: 280,
    },
    {
      field: "Phone",
      headerClassName: "super-app-theme--header",
      headerName: "Phone",
      width: 200,
    },
  ];

  const rows = Users.map((item, index) => {
    return {
      id: index,
      Avatar: item.userName[0].toUpperCase(),
      Email: item.Email,
      UserName: item.userName,
      Phone: item.Phone,
      Address: item.Address,
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
          <Typography variant="h5">Users</Typography>

          <Box
            sx={{
              height: "90vh",
              width: "95%",
              "& .super-app-theme--header": {
                backgroundColor: "#F4F6F8",
                color: "black",
                fontSize: "15px",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 8,
                  },
                },
              }}
              pageSizeOptions={[8]}
              disableRowSelectionOnClick
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
