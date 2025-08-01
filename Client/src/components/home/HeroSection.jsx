import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 bg-[#061f1c] w-full">
      <h1 className="text-white text-5xl md:text-7xl font-bold mb-16" style={{lineHeight:1.1}}>
        <span className="block">The <span className="font-thin">multipurpose</span></span>
        <span className="block">eCommerce</span>
        <span className="block">store</span>
      </h1>
      <div className="flex flex-col md:flex-row gap-6 mt-12 justify-center items-center">
        <button
          className="bg-white text-[#061f1c] font-bold px-10 py-4 rounded-full text-xl shadow hover:bg-gray-200 transition-all"
          style={{fontWeight:'bold'}}
          onClick={() => navigate('/products')}
        >
          Explore Now
        </button>
        <button
          className="bg-transparent border-2 border-lime-400 text-white font-bold px-10 py-4 rounded-full text-xl hover:bg-lime-400 hover:text-[#061f1c] transition-all"
          style={{fontWeight:'bold'}}
          onClick={() => navigate('/new-collection')}
        >
          New Collection
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
