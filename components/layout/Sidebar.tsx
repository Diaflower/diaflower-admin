import Link from 'next/link'
import { HomeIcon, ShoppingCartIcon, PackageIcon, UsersIcon, BarChartIcon, TagIcon, LayersIcon, FolderIcon , PackageOpen ,Flower2 , Flower , Diameter} from 'lucide-react'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Flower Admin</h1>
      </div>
      <nav className="mt-6">
        <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <HomeIcon className="w-5 h-5 mr-2" />
          Dashboard
        </Link>
        <div>
          <div className="flex items-center px-4 py-2 text-gray-700">
            <PackageIcon className="w-5 h-5 mr-2" />
            Products
          </div>
          <div className="ml-6">
            <Link href="/products" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <LayersIcon className="w-4 h-4 mr-2" />
              All Products
            </Link>
            <Link href="/categories" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <FolderIcon className="w-4 h-4 mr-2" />
              Categories
            </Link>
            <Link href="/tags" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <TagIcon className="w-4 h-4 mr-2" />
              Tags
            </Link>
            <Link href="/infinity-color" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <Flower className="w-4 h-4 mr-2" />
              Infinity Color
            </Link>
            <Link href="/box-color" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <PackageOpen className="w-4 h-4 mr-2" />
              Box Color
            </Link>
            <Link href="/size" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <Diameter className="w-4 h-4 mr-2" />
              Size
            </Link>
            <Link href="/used-flower" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <Flower2 className="w-4 h-4 mr-2" />
              Used Flowers
            </Link>
          </div>
        </div>
        <Link href="/orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <ShoppingCartIcon className="w-5 h-5 mr-2" />
          Orders
        </Link>
        <Link href="/customers" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <UsersIcon className="w-5 h-5 mr-2" />
          Customers
        </Link>
        <Link href="/analytics" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <BarChartIcon className="w-5 h-5 mr-2" />
          Analytics
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar