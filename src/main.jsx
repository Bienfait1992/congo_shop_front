import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
// import DashboardLayout from "./layouts/DashboardLayout";

// Pages Auth

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";

// Composants pour la protection des routes
import { GuestOnly } from "./components/GuestOnly";
import { RequireAuth } from "./components/RequireAuth";
import DeliveryDashboard from "./features/dashboard/delivery/DeliveryDashboard";
import ClientDashboard from "./features/dashboard/client/ClientDashboard";
import ProductListPage from "./features/products/pages/ProductListPage";
import CreateShopPage from "./features/shop/pages/Create_Shop_Page";
import MainLayout from "./layouts/MainLayout";
import AccountPage from "./features/dashboard/Users/AccountPage";
import ProductDetailsPage from "./features/products/pages/ProductDetailsPage";
import CartPage from "./features/cart/presentation/pages/CartPage";
import StatsPage from "./features/dashboard/Admin/Pages/StatsPage";
import ShopsPage from "./features/dashboard/Admin/Pages/ShopsPage";
import UsersPage from "./features/dashboard/Admin/Pages/UsersPage";
import ProductsPage from "./features/dashboard/Admin/Pages/ProductsPage";
import MyShops from "./features/dashboard/Users/MyShops";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ShopDetailPage from "./features/shop/pages/ShopDetailPage";
import ShopProductsPage from "./features/shop/pages/ShopProductsPage";
import CreateCategoryPage from "./features/products/pages/CreateCategoryPage";
import SearchPage from "./features/products/pages/SearchPage";
import BecomeDeliveryPage from "./features/deliveryman/pages/SignupDeliveryPage";
import AdminDeliveryRequests from "./features/dashboard/Admin/Pages/AdminDeliveryRequests";
import DeliveryAddressPage from "./features/dashboard/delivery/delivery-address";


const router = createBrowserRouter([
  
  // Routes Auth (Login / Signup) -> visibles seulement pour les non-connectés
  
 {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ProductListPage />,
      },
      {
              path: "/search",
              element: <SearchPage />,
            },
      {
        path: "create-shop",
        element: <RequireAuth roles={["CLIENT", "SELLER"]} />,
        children: [
          {
            index: true,
            element: <CreateShopPage />,
          },
        ],
      },
      {
        path: "create-deliveryman",
        element: <RequireAuth roles={["CLIENT", "SELLER"]} />,
        children: [
          {
            index: true,
            element: <BecomeDeliveryPage />,
          },
        ],
      },
        
            {
          path: "/my-shops",
          element: <RequireAuth role="SELLER" />,
          children: [
            {
              index: true,
              element: <MyShops />,
            },
             {
               path: "/my-shops/:shopId",
              element: <ShopDetailPage />,
            },
             {
               path: "/my-shops/:shopId/products",
              element: <ShopProductsPage />,
            },
            

          ],
        },
            {
      path: "/account",
      element: <RequireAuth />, // protège la route
      children: [
        {
          index: true,
          element: <AccountPage />,
        },
      ],
    },

    {
     path: "products/:id",
     element: <ProductDetailsPage />,
    },
    {
     path: "/cart",
     element: <CartPage />,
    },

    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
    // {
    //   path: "/delivery-address",
    //   element: <DeliveryAddressPage />,
    // },
            {
      path: "/delivery-address",
      element: <RequireAuth />, // protège la route
      children: [
        {
          index: true,
          element: <DeliveryAddressPage />,
        },
      ],
    },
    ],
    
  },

  //   {
  //   path: "cart",
  //   element: <RequireAuth />,
  //   children: [
  //     {
  //       index: true,
  //       element: <CartPage />,
  //     },
  //   ],
  // },
    {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> }
    ]
  },

  // Dashboard utilisateur (CLIENT)
  // {
  //   path: "/dashboard",
  //   element: <RequireAuth role="CLIENT" />, // doit être connecté et rôle CLIENT
  //   children: [
  //     {
  //       index: true,
  //       element: <ClientDashboard />, // page par défaut
  //     },
  //     // ici tu peux ajouter d'autres pages utilisateurs
  //     // { path: "orders", element: <OrdersPage /> },
  //   ],
  // },

  // Dashboard admin
  // Dans ton router React Router v6
{
  path: "/dashboard_admin",
  element: <RequireAuth role="ADMIN" />, // protège la route pour ADMIN uniquement
  children: [
    {
      element: <AdminLayout />, // layout avec Sidebar + Navbar + Outlet
      children: [
        // Page par défaut (Statistiques)
        {
          index: true,
          element: <StatsPage />, // la page des statistiques
        },
        // Boutiques
        {
          path: "shops",
          element: <ShopsPage />, // page pour gérer les boutiques (PENDING → APPROVED/REJECTED)
        },
        // Utilisateurs
        {
          path: "users",
          element: <UsersPage />, // page pour gérer les utilisateurs
        },
        // Produits
        {
          path: "products",
          element: <ProductsPage />, // page pour gérer les produits
        },
        {
          path: "category",
          element: <CreateCategoryPage />, // page pour gérer les produits
        },
        {
          path: "livreur",
          element: <AdminDeliveryRequests />, // page pour gérer les produits
        },
      ],
    },
  ],
},
  // Dashboard livreur
  {
    path: "/dashboard_delivery",
    element: <RequireAuth role="DELIVERY" />,
    children: [
      {
        index: true,
        element: <DeliveryDashboard />, // tu peux créer DeliveryDashboard
      },
    ],
  },

  // Catch-all pour 404
  { path: "*", element: <div>Page non trouvée</div> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-right" />
  </React.StrictMode>
);

