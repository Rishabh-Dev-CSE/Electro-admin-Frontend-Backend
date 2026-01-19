import React from "react";
import HomeHeroSection from "./HomeHeroSection";
import Navbar from "../navbar/navbar";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import Footer from "../footer/Footer";
import WhyUseSimple from "./WhyUseSimple";
// import VideoCarousel from "./VideoCarousel";


const HomeRoute = () => {
    return (
        <>
            <Navbar/>
            <HomeHeroSection />
            <FeaturesSection />
            <WhyUseSimple />
            <HowItWorksSection />
            <Footer />
        </>
    )
}

export default HomeRoute;
