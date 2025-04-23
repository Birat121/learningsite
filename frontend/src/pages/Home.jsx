import React from 'react'
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import WhyChooseMe from '../components/ChooseMe';
import Courses from '../components/CoursesWeOffer';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <>
     <Helmet>
        {/* Title for the Home Page */}
        <title>Learn Real Estate Online - YourPlatformName</title>

        {/* Meta description for better search engine indexing */}
        <meta
          name="description"
          content="Start your journey in real estate today with our expert-led courses. Explore various topics and build your career with hands-on training."
        />

        {/* Meta keywords for additional SEO boost */}
        <meta
          name="keywords"
          content="real estate courses, learn real estate online, real estate training, real estate career"
        />
      </Helmet>
    <Hero />
    <Introduction/>
    <WhyChooseMe/>
    <Courses/>

    </>
  )
}

export default Home;
