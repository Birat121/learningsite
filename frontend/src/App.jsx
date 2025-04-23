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
import ProfilePage from "./pages/ProfilePage";
import AdminRoute from "./components/ProtectedRoute";
import EnrolledCoursesPage from "./pages/EnrollerdCourse";  
import CheckoutPage from "./pages/CheckOutPage";
import { Toaster } from "react-hot-toast";
import AdminLogin from "./pages/AdminLogin";
import QuizPage from "./components/QuizPage";
import QuizList from "./components/quizList";
import OAuthHandler from "./components/OAuth";
import PayPalSuccess from "./components/PayPalSuccess";



function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/why-dubai" element={<WhyUs />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/oauth-success" element={<OAuthHandler />} />
        <Route path="/paypal/success" element={<PayPalSuccess />} />
      

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <SignInForm />
            </PublicOnlyRoute>
          }
        />

        {/* User Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/enrolledCOurse"
          element={
            <PrivateRoute>
              <EnrolledCoursesPage />
            </PrivateRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  }
>
  <Route
    path="/admin/dashboard/add"
    element={
      <AdminRoute>
        <AddPage />
      </AdminRoute>
    }
  />
  <Route
    path="/admin/dashboard/list"
    element={
      <AdminRoute>
        <ListPage />
      </AdminRoute>
    }
  />
  <Route
    path="/admin/dashboard/quiz"
    element={
      <AdminRoute>
        <QuizPage />
      </AdminRoute>
    }
  />
  <Route
    path="/admin/dashboard/listquiz"
    element={
      <AdminRoute>
        <QuizList />
      </AdminRoute>
    }
  />

</Route>

      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
