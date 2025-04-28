import React from "react";
import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Homepage = lazy(() => import("./Pages/Home/Homepage"));
const Product = lazy(() => import("./Pages/Product/Product"));
import { CartContainer } from "./context/Cartcontext";
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const Addprod = lazy(() => import("./Pages/AddProduct/Addprod"));

import { ProductContainer } from "./context/ProductContext";
import Admin from "./Pages/Admin/Admin";
import UserReviews from "./Pages/history/Reviews";
import Chatbot from "./Components/Chatbot/Chatbot";
const LoginPage = lazy(() => import("./Pages/Login/LoginPage"));
const Editprod = lazy(() => import("./Pages/EditProduct/Editprod"));
const RegisterPage = lazy(() => import("./Pages/Register/RegisterPage"));

const History = lazy(() => import("./Pages/history/History"));
const Productall = lazy(() => import("./Pages/Home/Productall"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const Users = lazy(() => import("./Pages/Admin/Users"));
const Products = lazy(() => import("./Pages/Admin/Products"));
const Navbar = lazy(() => import("./Components/Navbar/Navbar"));
const ScrolltoTop = lazy(() => import("./Components/ScrolltoTop/ScrolltoTop"));

function App() {
  return (
    <>
      <BrowserRouter>
        <CartContainer>
          <ProductContainer>
            <Navbar />
            <Suspense>
              <ScrolltoTop />
              <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route path="/UserHistory/:userName" element={<History />} />
                <Route path="/Reviews/:userName" element={<UserReviews />} />
                <Route path="/Product/:id" element={<Product />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/Product/edit/:id" element={<Editprod />} />
                <Route path="/addproduct" element={<Addprod />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/Signup" element={<RegisterPage />} />
                <Route path="/Category/:name" element={<Productall />} />

                <Route path="/Admin/Dashboard" element={<Dashboard />} />
                <Route path="/Admin/Users" element={<Users />} />
                <Route path="/Admin/Products" element={<Products />} />
                <Route path="/Administrator" element={<Admin />} />
              </Routes>
            </Suspense>
            <Chatbot />
          </ProductContainer>
        </CartContainer>
      </BrowserRouter>
    </>
  );
}

export default App;
