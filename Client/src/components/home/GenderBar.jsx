import { Link } from "react-router-dom"
import { Button } from "../ui/button"

const GenderBar = () => {
  return (
    <div className="bg-gray-100 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8 py-4">
          <Link to="/gender/men">
            <Button variant="ghost" className="text-lg font-semibold hover:text-primary">
              Men
            </Button>
          </Link>
          <Link to="/gender/women">
            <Button variant="ghost" className="text-lg font-semibold hover:text-primary">
              Women
            </Button>
          </Link>
          <Link to="/gender/unisex">
            <Button variant="ghost" className="text-lg font-semibold hover:text-primary">
              Unisex
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GenderBar
