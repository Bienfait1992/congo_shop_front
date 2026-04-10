// layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../features/dashboard/pages/Sidebar";
import DashboardNavbar from "../features/dashboard/pages/Navbar";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Footer } from "../features/dashboard/Admin/components/Footer";
// import Footer from "../features/dashboard/Users/Footer";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar toggleSidebar={toggleSidebar} />

        {/* Contenu des pages */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
          <Footer />
        </main>
      </div>

      {/* Notifications toast */}
      <Toaster position="top-right" />
    </div>
  );
}


// // layouts/AdminLayout.jsx
// import { Outlet } from "react-router-dom";
// import { Sidebar } from "../features/dashboard/pages/Sidebar";
// import DashboardNavbar from "../features/dashboard/pages/Navbar";
// import { Toaster } from "react-hot-toast";
// import { useState } from "react";
// import { Footer } from "../features/dashboard/Admin/components/Footer";

// export default function AdminLayout() {
//   const [isOpen, setIsOpen] = useState(true);
//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar isOpen={isOpen} />

//       {/* Contenu principal */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <DashboardNavbar toggleSidebar={toggleSidebar} />

//         {/* Zone contenu + footer */}
//         <div className="flex flex-col flex-1">
//           {/* Contenu */}
//           <main className="flex-1 p-4 overflow-auto">
//             <Outlet />
//           </main>

//           {/* Footer toujours en bas */}
//           <Footer />
//         </div>
//       </div>

//       <Toaster position="top-right" />
//     </div>
//   );
// }