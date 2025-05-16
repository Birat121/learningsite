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
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentFailure";
import AddBlog from "./components/AddBlog";
import ListBlogs from "./components/ListBlog";
import BlogDetail from "./components/BlogDetail";
import WatchCourse from "./components/WatchCourse";
import AdminHeroEditor from "./components/HeroEditor";
import AdminIntroduction from "./components/IntroEditor";
import PodcastVideoManager from "./components/Youtube";
import ModuleVideoManagementPage from "./components/ModuleManagement";

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
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/why-dubai" element={<WhyUs />} />
        <Route path="/checkout/:slug" element={<CheckoutPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/oauth-success" element={<OAuthHandler />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

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

        <Route
          path="/watch/:slug"
          element={
            <PrivateRoute>
              <WatchCourse />
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
          <Route
            path="/admin/dashboard/addblog"
            element={
              <AdminRoute>
                <AddBlog />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard/listblog"
            element={
              <AdminRoute>
                <ListBlogs />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard/heroeditor"
            element={
              <AdminRoute>
                <AdminHeroEditor />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard/introeditor"
            element={
              <AdminRoute>
                <AdminIntroduction />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard/youtubeadd"
            element={
              <AdminRoute>
                <PodcastVideoManager />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard/listModules"
            element={
              <AdminRoute>
                <ModuleVideoManagementPage />
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
