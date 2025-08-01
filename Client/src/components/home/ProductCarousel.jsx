"use client"

import { useState, useRef, useEffect } from "react"
import Furniture from '../../assets/Furniture.jpg'
import Electronics from '../../assets/Electronics.jpg'
import Perfumes from '../../assets/Perfumes.jpg'
import Women from '../../assets/Women.jpg'
import Mens from '../../assets/Mens.webp'
import Jewellery from '../../assets/jewellery.png'

const collections = [
  { img: Furniture, name: 'Furniture Collection' },
  { img: Perfumes, name: 'Perfumes Collection' },
  { img: Electronics, name: 'Electronics Collection' },
  { img: Women, name: 'Women Collection' },
  { img: Mens, name: 'Men Collection' },
  { img: Jewellery, name: 'Jewellery Collection' },
]

function C_Box({ img, collection, bgColor = '#3b82f6' }) {
  return (
    <div className="h-[24rem] w-[500px] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-end overflow-hidden border-4 border-white flex-shrink-0" style={{marginRight: '2.5rem'}}>
      <img 
        src={img}
        className="h-full w-full rounded-2xl flex items-center justify-center text-white text-xl font-bold"
      />
      <div className="w-full bg-white text-black text-lg font-semibold text-center py-3 rounded-b-2xl">
        {collection} &rarr;
      </div>
    </div>
  )
}

const ProductCarousel = () => {
  // Create color variations for visual distinction
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
  
  // Double the collections for seamless loop
  const doubledCollections = [...collections, ...collections]
  
  const boxWidth = 500 + 40 // 500px width + 40px gap
  const totalWidth = collections.length * boxWidth
  
  const carouselStyle = {
    width: `${doubledCollections.length * boxWidth}px`,
    animation: `slideLeft ${collections.length * 8}s linear infinite`,
  }

  return (
    <div className="w-full bg-[#061f1c]">
      <style jsx>{`
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalWidth}px);
          }
        }
      `}</style>
      
      <div className="relative w-full flex items-center justify-center" style={{height:'26rem'}}>
        <div 
          className="flex overflow-hidden w-full justify-start"
        >
          <div
            className="flex"
            style={carouselStyle}
          >
            {doubledCollections.map((col, idx) => (
              <C_Box 
                key={idx} 
                img={col.img} 
                collection={col.name}
                bgColor={colors[idx % colors.length]}
              />
            ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}
export default ProductCarousel
