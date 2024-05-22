








// // // TODO: 
// // // Refactor to use Blue, Dark, Green, Red, White as item names and on hover display a random background image from the respective folder- DONE
// // // Make sure that on hover of new images the old image is cleaned up
// // // From the selected displayed landscape image, display 2-3 images from the corresponding portrait folder, alongside their respective titles, photographer, and descriptions
// // // Make sure that on hover the old images are cleaned up
// // // Animate the image load-ins with gsap



// "use client";

// import Image from "next/image";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import gsap from "gsap";
// import { backgrounds, foregrounds, mapClasses } from "../../components/data";

// type ClipPathVariants = Record<string, string>;

// type Transform = {
//   x?: number;
//   y?: number;
//   opacity?: number;
// };

// type VariantTransforms = Record<string, {
//   title?: Transform;
//   photographer?: Transform;
//   description?: Transform;
// }>;

// const defaultClipPaths: ClipPathVariants = {
//   "variant-1": "polygon(0% 100%, 100% 100%, 100% 0%, 0% 100%)",
//   "variant-2": "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
//   "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
// };

// const variantTransforms: VariantTransforms = {
//   "variant-1": {
//     title: { x: 75, opacity: 0 },
//     photographer: { y: -75, opacity: 0 },
//     description: { x: -75, opacity: 0 },
//   },
//   "variant-2": {
//     title: { x: -75, opacity: 0 },
//     photographer: { y: -75, opacity: 0 },
//     description: { y: 75, opacity: 0 },
//   },
//   "variant-3": {
//     title: { x: 75, opacity: 0 },
//     photographer: { y: 75, opacity: 0 },
//     description: { x: 75, opacity: 0 },
//   },
// };

// const getDefaultClipPath = (previewElement: HTMLElement): string => {
//   for (const variant in defaultClipPaths) {
//     if (previewElement.classList.contains(variant)) {
//       return defaultClipPaths[variant];
//     }
//   }
//   return "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)";
// };

// const applyVariantStyles = (previewElement: HTMLElement, reset = false): void => {
//   const variant = previewElement.className.split(" ").find((className) => className.startsWith("variant-"));
//   if (variant && variantTransforms[variant]) {
//     Object.entries(variantTransforms[variant]).forEach(([elementClass, transform]) => {
//       const element = previewElement.querySelector(`.preview-${elementClass}`) as HTMLElement;
//       if (element) {
//         if (reset) {
//           gsap.to(element, { x: 0, y: 0, opacity: 1, duration: 0.5 });
//         } else {
//           gsap.set(element, transform);
//         }
//       }
//     });
//   }
// };

// const Home = () => {
//   const [bgImage, setBgImage] = useState("/images/backgrounds/blue/1.jpeg");
//   const [variant, setVariant] = useState("");

//   const handleHover = (color: string) => {
//     const colorImages = backgrounds.filter(bg => bg.img.includes(color));
//     const randomBgImage = colorImages[Math.floor(Math.random() * colorImages.length)];
//     setBgImage(randomBgImage.img);

//     const randomVariant = mapClasses[Math.floor(Math.random() * mapClasses.length)];
//     setVariant(randomVariant);
//   };

//   const handleMouseEnter = useCallback((index: number) => {
//     const newActivePreview = document.querySelector(`.preview-${index + 1}`) as HTMLElement;
//     if (newActivePreview) {
//       const elementsToAnimate = ["title", "photographer", "description"];
//       elementsToAnimate.forEach((el) => {
//         const element = newActivePreview.querySelector(`.preview-${el}`) as HTMLElement;
//         if (element) {
//           gsap.to(element, { x: 0, y: 0, opacity: 1, duration: 0.5 });
//         }
//       });
      
//       const activePreviewImg = newActivePreview.querySelector(".preview-img") as HTMLElement;
//       gsap.to(activePreviewImg, {
//         clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//         duration: 1,
//         ease: "power3.out",
//       });
//     }
//   }, []);

//   useEffect(() => {
//     const container = document.querySelector(".container") as HTMLElement;
    
//     foregrounds.forEach((item, index) => {
//       const previewElement = document.createElement("div");
//       previewElement.className = `preview ${mapClasses[index]} preview-${index + 1}`;
//       previewElement.innerHTML = `
//         <div class="preview-img"><img src="${item.img}" alt="" /></div>
//         <div class="preview-title preview-title-${mapClasses[index]}"><h1>${item.title}</h1></div>
//         <div class="preview-photographer preview-photographer-${mapClasses[index]}"><p>${item.photographer}</p></div>
//         <div class="preview-description preview-description-${mapClasses[index]}"><p>${item.description}</p></div>
//       `;
//       container.appendChild(previewElement);
//       applyVariantStyles(previewElement);
//     });

//     const items = document.querySelectorAll(".item");
//     items.forEach((item, index) => {
//       item.addEventListener("mouseenter", () => handleMouseEnter(index));
//     });
//   }, [handleMouseEnter]);

//   return (
//     <main className="h-screen w-screen">
//       <div className="container">
//         <div className="items">
//           {["blue", "dark", "green", "red", "white"].map((color, i) => (
//             <div
//               className="item"
//               key={i}
//               onMouseEnter={() => handleHover(color)}
//             >
//               <p>{color.charAt(0).toUpperCase() + color.slice(1)}</p>
//             </div>
//           ))}
//         </div>
//         <div className="preview-bg absolute z-0">
//           <Image
//             src={bgImage}
//             alt="Background Preview"
//             fill={true}
//             object-fit="cover"
//           />
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Home;
