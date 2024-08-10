// TODO:
// 1. Fade between background changes
// 2. Tidy and comment code



"use client"

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { backgrounds, previews, mapClasses } from "../../components/data";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type ClipPathVariants = Record<string, string>;

type Transform = {
  x?: number;
  y?: number;
  opacity?: number;
};

type VariantTransforms = Record<string, {
  title?: Transform;
  photographer?: Transform;
  description?: Transform;
}>;

const defaultClipPaths: ClipPathVariants = {
  "variant-1": "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", //bottom line
  "variant-2": "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", //right line
  "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", //left line
};

const activeClipPaths: ClipPathVariants = {
  "variant-1": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", //square
  "variant-2": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", //square
  "variant-3": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", //square
};

const variantTransforms: VariantTransforms = {
  "variant-1": {
    title: { y: -30, opacity: 1 },
    photographer: { x: -30, opacity: 1 },
    description: { x: 30, opacity: 1 },
  },
  "variant-2": {
    title: { y: -30, opacity: 1 },
    photographer: { x: -30, opacity: 1 },
    description: { x: 30, opacity: 1 },
  },
  "variant-3": {
    title: { y: -30, opacity: 1 },
    photographer: { x: -30, opacity: 1 },
    description: { x: 30, opacity: 1 },
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
  return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"; //square
};

const applyVariantStyles = (previewElement: HTMLElement, reset = false): void => {
  const variant = previewElement.className.split(" ").find((className) => className.startsWith("variant-"));
  if (variant && variantTransforms[variant]) {
    Object.entries(variantTransforms[variant]).forEach(([elementClass, transform]) => {
      const element = previewElement.querySelector(`.preview-${elementClass}`) as HTMLElement;
      if (element) {
        if (reset) {
          gsap.to(element, { x: 0, y: 0, opacity: 0, duration: 0.4,});
        } else {
          gsap.to(element, { ...transform, duration: 0.5 });
        }
      }
    });
  }
};

// Image preloading
const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(
    imageUrls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = document.createElement('img');
          img.src = url;
          console.log(img.src)
          console.log(url)
          img.onload = () => resolve();
          img.onerror = () => reject();
        })
    )
  );
};

const Home = () => {
  const [bgImage, setBgImage] = useState("/images/backgrounds/green/2.webp");
  const [previewData, setPreviewData] = useState({
    img: "",
    title: "",
    photographer: "",
    description: "",
    variant: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allImages = [
      ...backgrounds.map((bg) => bg.img),
      ...previews.map((preview) => preview.img),
    ];

    preloadImages(allImages).then(() => {
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleClick = (color: string, index: number) => {
    const colorImages = backgrounds.filter((bg) => bg.img.includes(color));
    const randomImage = colorImages[Math.floor(Math.random() * colorImages.length)];
    setBgImage(randomImage.img);

    const colorPreviews = previews.filter((preview) => preview.img.includes(color));
    const randomPreview = colorPreviews[Math.floor(Math.random() * colorPreviews.length)];
    setPreviewData({
      img: randomPreview ? randomPreview.img : "",
      title: randomPreview ? randomPreview.title : "",
      photographer: randomPreview ? randomPreview.photographer : "",
      description: randomPreview ? randomPreview.description : "",
      variant: mapClasses[index],
    });

    setTimeout(() => {
      // Reset clip paths of all variants
      mapClasses.forEach((variantClass) => {
        const previewElement = document.querySelector(`.preview.${variantClass}`) as HTMLElement;
        if (previewElement) {
          gsap.set(previewElement.querySelector('.preview-img'), {
            clipPath: getDefaultClipPath(previewElement),
          });
          applyVariantStyles(previewElement, true);
        }
      });

      // Apply active clip path and styles to the hovered element
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

  useGSAP(() => {
    gsap.fromTo(".item",{ 
      x: -150,
     }, {
      duration: 1.5,
      x: 0,
      ease: "power4.out",
      stagger: 0.15,
    });
    gsap.fromTo(".preview-bg", { opacity: 0 }, {
      duration: 2,
      opacity: 0.25,
      ease: "power4.out",
    });

  });


  return (
    <main className="h-screen w-screen">
        <div className="items gap-6">
          {["blue", "dark", "green", "red", "white"].map((color, i) => (
            <div
              className="item"
              key={i}
              onClick={() => handleClick(color, i)}
            >
              <p className="w-24 text-center">{color.charAt(0).toUpperCase() + color.slice(1)}</p>
            </div>
          ))}
        </div>
        <div className="preview-bg absolute">
          <Image src={bgImage} className="background-image" alt="Preview" fill={true} priority={true} object-fit="cover" />
        </div>
        {previewData.img && (
          <div className={`preview ${previewData.variant}`}>
            <div className="preview-img">
              <Image
                src={previewData.img}
                alt="Foreground"
                height={400}
                width={400}
                objectFit="cover"
                priority={true}
                className="rounded-lg"
              />
            </div>
            <div className="preview-title">
              <h1>{previewData.title}</h1>
            </div>
            <div className="preview-photographer">
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
