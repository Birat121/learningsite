import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ContactUs from './pages/ContactUs'
import Footer from './components/Footer'
import About from './pages/About'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetail'
import SignInForm from './pages/Login'
import ScrollToTop from './components/ScrollToTop'
import WhyUs from './pages/WhyUs'

function App() {
  

  return (
    <>
    <ScrollToTop />
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/home' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<ContactUs/>} />
      <Route path='/courses' element={<Courses />} />
      <Route path='/courses/:id' element={<CourseDetails/>} />
      <Route path ='/login' element={<SignInForm/>} />
      <Route path='/why-dubai' element={<WhyUs/>} />


    </Routes>
    <Footer/>
      
    </>
  )
}

export default App
