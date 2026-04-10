import { Outlet, Link } from "react-router-dom";
import Header from "../features/products/components/Header_product";
import Footer from "../features/dashboard/Users/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/*NAVBAR */}
       <Header />

      {/*CONTENU */}
      <main className="p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}