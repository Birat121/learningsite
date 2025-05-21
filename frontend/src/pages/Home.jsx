import React from 'react'
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import WhyChooseMe from '../components/ChooseMe';
import Courses from '../components/CoursesWeOffer';
import { Helmet } from 'react-helmet';
import PodcastHighlight from '../components/PodcastHighlight';

const Home = () => {
  return (
    <>
     <Helmet>
        {/* Title for the Home Page */}
        <title>Learn Real Estate Online - Koffee With Kirren</title>

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

        {/* Canonical URL */}
        <link rel="canonical" href="https://koffeewithkirren.com/" />
      </Helmet>
    <Hero />
    <Introduction/>
    <WhyChooseMe/>
    <PodcastHighlight/>
    <Courses/>

    </>
  )
}

export default Home;
