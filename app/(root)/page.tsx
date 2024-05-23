"use client"

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { backgrounds, previews, mapClasses } from "../../components/data";
import gsap from "gsap";

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
  "variant-1": "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
  "variant-2": "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
  "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
};

const activeClipPaths: ClipPathVariants = {
  "variant-1": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  "variant-2": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  "variant-3": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
};

const variantTransforms: VariantTransforms = {
  "variant-1": {
    title: { y: -20 },
    tags: { x: -20 },
    description: { x: 20 },
  },
  "variant-2": {
    title: { y: -20 },
    tags: { x: -20 },
    description: { x: 20 },
  },
  "variant-3": {
    title: { y: -20 },
    tags: { x: -20 },
    description: { x: 20 },
  },
};

const getDefaultClipPath = (previewElement: HTMLElement): string => {
  for (const variant in defaultClipPaths) {
    if (previewElement.classList.contains(variant)) {
      return defaultClipPaths[variant];
    }
  }
  return "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)"; //square
};

const getActiveClipPath = (previewElement: HTMLElement): string => {
  for (const variant in activeClipPaths) {
    if (previewElement.classList.contains(variant)) {
      return activeClipPaths[variant];
    }
  }
  return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
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
          gsap.to(element, { ...transform, duration: 0.5 });
        }
      }
    });
  }
};

const Home = () => {
  const [bgImage, setBgImage] = useState("/images/backgrounds/blue/1.jpeg");
  const [previewData, setPreviewData] = useState({
    img: "",
    title: "",
    photographer: "",
    description: "",
    variant: "",
  });

  const handleHover = (color: string, index: number) => {
    const colorImages = backgrounds.filter((bg) => bg.img.includes(color));
    const randomImage = colorImages[Math.floor(Math.random() * colorImages.length)];
    setBgImage(randomImage.img);

    const preview = previews.find((preview) => preview.img.includes(color));
    setPreviewData({
      img: preview ? preview.img : "",
      title: preview ? preview.title : "",
      photographer: preview ? preview.photographer : "",
      description: preview ? preview.description : "",
      variant: mapClasses[index],
    });

    setTimeout(() => {
      const previewElement = document.querySelector(`.preview.${mapClasses[index]}`) as HTMLElement;
      if (previewElement) {
        gsap.to(previewElement.querySelector('.preview-img'), {
          clipPath: getActiveClipPath(previewElement),
          duration: 0.5,
        });
        applyVariantStyles(previewElement);
      }
    }, 10);
  };

  const handleMouseLeave = () => {
    const previewElement = document.querySelector('.preview') as HTMLElement;
    if (previewElement) {
      gsap.to(previewElement.querySelector('.preview-img'), {
        clipPath: getDefaultClipPath(previewElement),
        duration: 0.5,
      });
      applyVariantStyles(previewElement, true);
    }
  };

  useEffect(() => {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
      item.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      items.forEach(item => {
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <main className="h-screen w-screen">
        <div className="items">
          {["blue", "dark", "green", "red", "white"].map((color, i) => (
            <div
              className="item"
              key={i}
              onMouseEnter={() => handleHover(color, i)}
            >
              <p>{color.charAt(0).toUpperCase() + color.slice(1)}</p>
            </div>
          ))}
        </div>
        <div className="preview-bg absolute">
          <Image src={bgImage} className="background-image" alt="Preview" fill={true} object-fit="cover" />
        </div>
        {previewData.img && (
          <div className={`preview ${previewData.variant}`}>
            <div className="preview-img">
              <Image
                src={previewData.img}
                alt="Foreground"
                height={400}
                width={400}
                object-fit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="preview-title">
              <h1>{previewData.title}</h1>
            </div>
            <div className="preview-tags">
              <p>{previewData.photographer}</p>
            </div>
            <div className="preview-description">
              <p>{previewData.description}</p>
            </div>
          </div>
        )}
    </main>
  );
};

export default Home;

