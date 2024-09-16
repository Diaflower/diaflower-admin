// // import ProductFormNew from '@/components/forms/ProductFormNew';


// // export default function CreateProductPage() {
// //   return <ProductFormNew />;
// // }


// // app/products/create/page.tsx

// import {ProductForm} from '@/components/forms/ProductForm'


// const CreateProductPage = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Create Product</h1>
//       <ProductForm />
//     </div>
//   )
// }

// export default CreateProductPage



'use client'

// import ProductForm from '@/components/ProductForm'
import ProductForm from '@/components/forms/ProductForm'

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Create New Product</h1>
      <ProductForm />
    </div>
  )
}