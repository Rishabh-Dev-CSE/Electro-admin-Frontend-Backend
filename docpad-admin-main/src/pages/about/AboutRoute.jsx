import React from "react";
import AboutHero from "./AboutHero";
import Navbar from "../navbar/navbar";
import Showdata from "../test/apitest";

const  AboutRoute = () => {
    return (
        <>
            <Navbar />
            <AboutHero />
            <Showdata />
        </>
    )
}

export default AboutRoute;