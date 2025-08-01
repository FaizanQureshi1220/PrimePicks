import HeroSection from "../components/home/HeroSection"
import ProductCarousel from "../components/home/ProductCarousel"
import CategoryGrid from "../components/home/CategoryGrid"

const HomePage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{background:'#061f1c'}}>
      <HeroSection />
      <div>
        <ProductCarousel />
      </div>
      <div>
        <CategoryGrid />
      </div>
    </div>
  )
}

export default HomePage
