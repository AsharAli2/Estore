import React from "react";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

export default function Loading({ open = false, text = "Loading...", size = 48 }) {
  return (
    <Backdrop
      open={open}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1200, color: "#fff" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={size} color="inherit" />
        {text && (
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {text}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
}
