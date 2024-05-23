"use client"

import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Header = () => {

  useGSAP(() => {
    gsap.fromTo("nav", {y: -100, opacity: 0}, {
      duration: 1.5,
      y: 0,
      opacity: 1,
      ease: "power4.out",
    });
  })


  return (
    <header>
      <nav>
        <div className="company-name">
          Merriweather<br></br>Furniture & Bedding
        </div>
        <div className="company-slogan">
          <p>Quality Furniture</p>
          <p>Quality Living</p>
        </div>

      </nav>
    </header>
  );
};

export default Header;
