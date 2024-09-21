
// import ProductWrapper from '@/components/shared/ProductWrapper';
// export default function Page() {
//   return <ProductWrapper />;
// }


// 'use client'

// import { useParams } from 'next/navigation'
// import {ProductForm} from '@/components/forms/ProductForm'

// const EditProductPage = () => {
//   const params = useParams()
//   const id = params.id

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
//       {id && <ProductForm productId={Number(id)} />}
//     </div>
//   )
// }

// export default EditProductPage

'use client'

// import ProductForm from '@/components/ProductForm'
import ProductForm from '@/components/forms/ProductForm'
import { useParams } from 'next/navigation'

export default function EditProductPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)
  // console.log("first,",productId)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Edit Product</h1>
      <ProductForm productId={productId} />
    </div>
  )
}