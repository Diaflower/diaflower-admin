import { MoveHorizontal } from 'lucide-react'
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ProductsPage = () => {
  // Mock data for products (replace this with data from your backend)
  const products = [
    {
      id: 1,
      image: "/path-to-image.jpg",
      name: "Laser Lemonade Machine",
      status: "Draft",
      price: 499.99,
      totalSales: 25,
      createdAt: "2023-07-12 10:42 AM"
    },
    // Add more product objects here
  ]

  return (
    <div className="container mx-auto py-10 h-screen"> {/* Change h-full to h-screen */}
      <Card className='h-full flex flex-col'>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your products and view their sales performance.</CardDescription>
            </div>
            <Button>Add Product</Button>
        </CardHeader>
       
        <CardContent className="flex-grow overflow-auto"> {/* Add flex-grow and overflow-auto */}
          <div className="flex justify-between items-center mb-4">
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter by</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                  <DropdownMenuItem>Archived</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
          <Table>
          <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image src={product.image} alt={product.name} width={50} height={50} />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge>{product.status}</Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.totalSales}</TableCell>
                    <TableCell>{product.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between mt-auto"> {/* Add mt-auto */}
          <div>Showing <strong>1-10</strong> of <strong>32</strong> products</div>
          <div className="flex gap-2">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ProductsPage




