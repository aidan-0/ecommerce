import Header from "@/components/ui/Header";
import Image from "next/image";
import React from "react";


export default function Home() {


  return (
    <main>
      <div className="items">
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
        <div className="item"><p>Item name</p></div>
      </div>



      <div className="preview-bg">
        <Image src="/images/landscape/red-landscape-siyan-peng-0j19szbmQO4-unsplash.jpeg" alt="Preview" layout="fill" objectFit="cover" />
      </div>
    </main>
    
  );
}
