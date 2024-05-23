"use client"

import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Footer = () => {

  useGSAP(() => {
    gsap.fromTo(".collection", {y: 100, opacity: 0}, {y: 0, opacity: 1, duration: 1.5, ease: "power4.out"}),
    gsap.fromTo(".concept-design", {x: 200, opacity: 0}, {x: 0, opacity: 1, duration: 1.5, ease: "power4.out"})
  });

  return (
    <footer>
      <div className="collection">
        {/* "High-end Collection" */}
        <p>Collection Haut de Gamme</p> 
        <p>2024 Catalogue</p>
      </div>
      <div className="concept-design">
        <p>A Concept Design</p>
        <p>by Aidan McDonald</p>
      </div>
    </footer>
  );
};

export default Footer;
