import { Link } from "react-router-dom"
import mensShirts from '../../assets/mens-shirts.jpg'
import mensShoes from '../../assets/mens-shoes.webp'
import mensWatches from '../../assets/mens-watches.jpg'
import womensBags from '../../assets/womens-bags.jpeg'
import womensDresses from '../../assets/Women.jpg'
import womensJewellery from '../../assets/womens-jewellery.jpeg'
import womensShoes from '../../assets/womens-shoes.jpeg'
import womensWatches from '../../assets/womens-watches.jpeg'
import tops from '../../assets/tops.jpeg'
import sunglasses from '../../assets/sunglasses.jpeg'
import laptops from '../../assets/laptops.jpeg'
import smartphones from '../../assets/smartphones.jpeg'
import tablets from '../../assets/tablets.jpeg'
import mobileAccessories from '../../assets/mobile-accessories.jpeg'
import furniture from '../../assets/furniture.jpeg'
import homeDecoration from '../../assets/home-decoration.jpeg'
import kitchenAccessories from '../../assets/kitchen-accessories.jpeg'
import groceries from '../../assets/groceries.jpeg'
import beauty from '../../assets/beauty.jpeg'
import fragrances from '../../assets/fragrance.jpeg'
import skincare from '../../assets/skin-care.jpeg'
import motorcycle from '../../assets/motor-cycle.jpeg'
import vehicle from '../../assets/vehicle.jpeg'
import sports from '../../assets/sports.jpeg'
import sportsAccessories from '../../assets/sports-accessories.jpeg'

const categories = [
  { name: "Mens Shirts", slug: "mens-shirts", img: mensShirts },
  { name: "Mens Shoes", slug: "mens-shoes", img: mensShoes },
  { name: "Mens Watches", slug: "mens-watches", img: mensWatches },
  { name: "Womens Bags", slug: "womens-bags", img: womensBags },
  { name: "Womens Dresses", slug: "womens-dresses", img: womensDresses },
  { name: "Womens Jewellery", slug: "womens-jewellery", img: womensJewellery },
  { name: "Womens Shoes", slug: "womens-shoes", img: womensShoes },
  { name: "Womens Watches", slug: "womens-watches", img: womensWatches },
  { name: "Tops", slug: "tops", img: tops },
  { name: "Sunglasses", slug: "sunglasses", img: sunglasses },
  { name: "Laptops", slug: "laptops", img: laptops },
  { name: "Smartphones", slug: "smartphones", img: smartphones },
  { name: "Tablets", slug: "tablets", img: tablets },
  { name: "Mobile Accessories", slug: "mobile-accessories", img: mobileAccessories },
  { name: "Furniture", slug: "furniture", img: furniture },
  { name: "Home Decoration", slug: "home-decoration", img: homeDecoration },
  { name: "Kitchen Accessories", slug: "kitchen-accessories", img: kitchenAccessories },
  { name: "Groceries", slug: "groceries", img: groceries },
  { name: "Beauty", slug: "beauty", img: beauty },
  { name: "Fragrances", slug: "fragrances", img: fragrances },
  { name: "Skin Care", slug: "skin-care", img: skincare },
  { name: "Motorcycle", slug: "motorcycle", img: motorcycle },
  { name: "Vehicle", slug: "vehicle", img: vehicle },
  { name: "Sports", slug: "sports", img: sports },
  { name: "Sports Accessories", slug: "sports-accessories", img: sportsAccessories },
]

const gridSpans = [
  "col-span-2 row-span-2", // Mens Shirts
  "col-span-2 row-span-1", // Mens Shoes
  "col-span-2 row-span-1", // Mens Watches
  "col-span-1 row-span-2", // Womens Bags
  "col-span-1 row-span-1", // Womens Dresses
  "col-span-1 row-span-1", // Womens Jewellery
  "col-span-2 row-span-2", // Womens Shoes
  "col-span-1 row-span-1", // Womens Watches
  "col-span-1 row-span-1", // Tops
  "col-span-2 row-span-1", // Sunglasses
  "col-span-2 row-span-2", // Laptops
  "col-span-1 row-span-1", // Smartphones
  "col-span-1 row-span-1", // Tablets
  "col-span-1 row-span-2", // Mobile Accessories
  "col-span-2 row-span-1", // Furniture
  "col-span-1 row-span-1", // Home Decoration
  "col-span-1 row-span-1", // Kitchen Accessories
  "col-span-2 row-span-1", // Groceries
]

const CategoryGrid = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-8 sm:mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[150px] md:auto-rows-[180px] lg:auto-rows-[220px] xl:auto-rows-[260px] w-full gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.slug}`}
              className={`relative flex flex-col items-center justify-end rounded-xl shadow-md hover:scale-[1.03] transition-transform duration-200 bg-white col-span-1 row-span-1 md:${gridSpans[index % gridSpans.length]}`}
              style={{margin:0, padding:0, border:0}}
            >
              <div className="w-[80%] h-[65%] mt-2 mb-1 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                <img src={category.img} alt={category.name} className="object-cover w-full h-full rounded-lg" />
              </div>
              <div className="w-full text-center text-black font-semibold text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2">
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
