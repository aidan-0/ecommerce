"use client";

// TODO: 
// Refactor to use Blue, Dark, Green, Red, White as item names and on hover display a random background image from the respective folder
// Make sure that on hover of new images the old image is cleaned up
// From the selected displayed landscape image, display 2-3 images from the corresponding portrait folder, alongside their respective titles, photographer, and descriptions
// Make sure that on hover the old images are cleaned up
// Animate the image load-ins with gsap


import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { mapClasses, previews } from "../../components/data";

type ClipPathVariants = Record<string, string>;

type Transform = {
  x?: number;
  y?: number;
  opacity?: number;
};

type VariantTransforms = Record<string, {
  title?: Transform;
  tags?: Transform;
  description?: Transform;
}>;

const defaultClipPaths: ClipPathVariants = {
  "variant-1": "polygon(0% 100%, 100% 100%, 100% 0%, 0% 100%)",
  "variant-2": "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
  "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
};

const variantTransforms: VariantTransforms = {
  "variant-1": {
    title: { x: 75, opacity: 0 },
    tags: { y: -75, opacity: 0 },
    description: { x: -75, opacity: 0 },
  },
  "variant-2": {
    title: { x: -75, opacity: 0 },
    tags: { y: -75, opacity: 0 },
    description: { y: 75, opacity: 0 },
  },
  "variant-3": {
    title: { x: 75, opacity: 0 },
    tags: { y: 75, opacity: 0 },
    description: { x: 75, opacity: 0 },
  },
};

const getDefaultClipPath = (previewElement: HTMLElement): string => {
  for (const variant in defaultClipPaths) {
    if (previewElement.classList.contains(variant)) {
      return defaultClipPaths[variant];
    }
  }
  return "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)";
};

const applyVariantStyles = (previewElement: HTMLElement, reset = false): void => {
  const variant = previewElement.className.split(" ").find((className) => className.startsWith("variant-"));
  if (variant && variantTransforms[variant]) {
    Object.entries(variantTransforms[variant]).forEach(([elementClass, transform]) => {
      const element = previewElement.querySelector(`.preview-${elementClass}`) as HTMLElement;
      if (element) {
        if (reset) {
          gsap.to(element, { x: 0, y: 0, opacity: 1, duration: 0.5 });
        } else {
          gsap.set(element, transform);
        }
      }
    });
  }
};

const changeBg = (newImgSrc: string): void => {
  const previewBg = document.querySelector(".preview-bg") as HTMLElement;
  const newImg = document.createElement("img");
  newImg.src = newImgSrc;
  newImg.style.position = "absolute";
  newImg.style.top = "0";
  newImg.style.left = "0";
  newImg.style.width = "100%";
  newImg.style.height = "100%";
  newImg.style.objectFit = "cover";
  newImg.style.opacity = "0";

  console.log(previewBg);

  previewBg.appendChild(newImg);
  console.log(newImg);  
  console.log(previewBg);


  gsap.to(newImg, { opacity: 1, duration: 0.5 });

  if (previewBg.children.length > 1) {
    const oldImg = previewBg.children[0] as HTMLElement;
    gsap.to(oldImg, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        previewBg.removeChild(oldImg);
      },
    });
  }
};

const Home: React.FC = () => {
  const [activePreview, setActivePreview] = useState<HTMLElement | null>(null);
  const [isMouseOverItem, setIsMouseOverItem] = useState<boolean>(false);

  const handleMouseEnter = useCallback((index: number) => {
    setIsMouseOverItem(true);
    const newBg = `/images/landscape/${index + 1}.jpeg`;
    changeBg(newBg);

    const newActivePreview = document.querySelector(`.preview-${index + 1}`) as HTMLElement;
    if (activePreview && activePreview !== newActivePreview) {
      const previousActivePreviewImg = activePreview.querySelector(".preview-img") as HTMLElement;
      const previousDefaultClipPath = getDefaultClipPath(activePreview);
      gsap.to(previousActivePreviewImg, {
        clipPath: previousDefaultClipPath,
        duration: 0.75,
        ease: "power3.out",
      });
    }

    const elementsToAnimate = ["title", "tags", "description"];
    elementsToAnimate.forEach((el) => {
      const element = newActivePreview.querySelector(`.preview-${el}`) as HTMLElement;
      if (element) {
        gsap.to(element, { x: 0, y: 0, opacity: 1, duration: 0.5 });
      }
    });

    const activePreviewImg = activePreview?.querySelector(".preview-img") as HTMLElement;
    gsap.to(activePreviewImg, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.out",
    });

    setActivePreview(newActivePreview);
  }, [activePreview]);

  const handleMouseLeave = useCallback(() => {
    setIsMouseOverItem(false);
    if (activePreview) {
      applyVariantStyles(activePreview, true);

      setTimeout(() => {
        if (!isMouseOverItem) {
          changeBg("/images/landscape/9.jpeg");
          if (activePreview) {
            gsap.to(activePreview, { opacity: 0, duration: 0.1 });
            const defaultPreview = document.querySelector(".preview.default") as HTMLElement;
            gsap.to(defaultPreview, { opacity: 1, duration: 0.1 });
            setActivePreview(defaultPreview);

            const activePreviewImg = activePreview.querySelector(".preview-img") as HTMLElement;
            const defaultClipPath = getDefaultClipPath(activePreview);
            gsap.to(activePreviewImg, {
              clipPath: defaultClipPath,
              duration: 1,
              ease: "power3.out",
            });
          }
        }
      }, 10);
    }
  }, [activePreview, isMouseOverItem]);

  useEffect(() => {
    const container = document.querySelector(".container") as HTMLElement;

    previews.forEach((preview, index) => {
      const previewElement = document.createElement("div");
      previewElement.className = `preview ${mapClasses[index]} preview-${index + 1}`;

      previewElement.innerHTML = `
        <div class="preview-img"><img src="${preview.img}" alt="" /></div>
        <div class="preview-title"><h1>${preview.title}</h1></div>
        <div class="preview-tags"><p>${preview.tags}</p></div>
        <div class="preview-description"><p>${preview.description}</p></div>
      `;

      container.appendChild(previewElement);
      applyVariantStyles(previewElement);
    });

    const items = document.querySelectorAll(".item");

    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => handleMouseEnter(index));
      item.addEventListener("mouseleave", handleMouseLeave);
    });
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <main>
      <div className="container">
        <div className="items">
          {Array.from({ length: 10 }, (_, i) => (
            <div className="item" key={i}><p>Item name</p></div>
          ))}
        </div>
        <div className="preview-bg absolute">
          <img
            src="/images/landscape/9.jpeg"
            alt="Preview"
            // fill={true}
            // objectFit="cover"
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
