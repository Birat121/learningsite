import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetail";
import SignInForm from "./pages/Login";
import WhyUs from "./pages/WhyUs";
import AdminPage from "./pages/AdminDashboard";
import AddPage from "./components/Add";
import ListPage from "./components/List";
import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicRoute";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {/* Conditionally render Navbar and Footer based on the route */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        
        {/* Login Route */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <SignInForm />
            </PublicOnlyRoute>
          }
        />

        <Route path="/why-dubai" element={<WhyUs />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        >
          <Route path="add" element={<AddPage />} />
          <Route path="list" element={<ListPage />} />
          {/* Add more routes like ListPage here */}
        </Route>
      </Routes>

      {/* Conditionally render Footer based on the route */}
      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
