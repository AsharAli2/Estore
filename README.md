# Estore

Estore is a full-stack e-commerce application with a React + Vite frontend and a Node.js + Express backend.  
It provides product browsing, product details, cart/checkout, user authentication, reviews, order history, and admin management tools.

## Core Features

### Customer features
- Browse products with pagination, search, category filter, brand filter, and sorting
- View product details with ratings and review list
- Add products to cart and place checkout orders
- Register and login
- View personal order history
- View personal reviews
- AI shopping assistant chatbot (VectorSearch API-backed)

### Admin features
- Admin dashboard view
- User management table
- Product management table
- Add new products
- Edit existing products
- Delete products

## Frontend Routes

The frontend is a SPA with React Router. Current routes:

| Route | Purpose |
|---|---|
| `/` | Redirects to `/Products` |
| `/Products` | Product listing page |
| `/Product/:id` | Product details page |
| `/Cart` | Cart and checkout page |
| `/Login` | User login page |
| `/Signup` | User registration page |
| `/UserHistory/:userName` | User order history page |
| `/Reviews/:userName` | User reviews page |
| `/Administrator` | Admin side menu/entry page |
| `/Admin/Dashboard` | Admin dashboard |
| `/Admin/Users` | Admin users table |
| `/Admin/Products` | Admin products table |
| `/addproduct` | Add product page (admin flow) |
| `/Product/edit/:id` | Edit product page (admin flow) |

## API Integration (high level)

Frontend uses `VITE_BACKEND_BASE_URL` as API base URL and integrates with backend endpoints for:
- Auth: login/register
- Products: list/details/add/edit/delete
- Reviews: product reviews and user reviews
- Orders: checkout and history
- Admin dashboards/tables data
- Chatbot: vector search assistant responses

## Tech Stack

- **Frontend:** React, Vite, React Router, MUI
- **Backend:** Node.js, Express, MongoDB/Mongoose
- **Other:** JWT auth, fetch-based API communication
