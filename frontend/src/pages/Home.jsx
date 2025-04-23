import React from 'react'
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import WhyChooseMe from '../components/ChooseMe';
import Courses from '../components/CoursesWeOffer';

const Home = () => {
  return (
    <>
    <Hero />
    <Introduction/>
    <WhyChooseMe/>
    <Courses/>

    </>
  )
}

export default Home;
