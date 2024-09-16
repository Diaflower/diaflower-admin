import * as z from 'zod'

export const productSchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_ar: z.string().min(1, 'Arabic name is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription_en: z.string().min(1, 'English short description is required'),
  shortDescription_ar: z.string().min(1, 'Arabic short description is required'),
  longDescription_en: z.string().min(1, 'English long description is required'),
  longDescription_ar: z.string().min(1, 'Arabic long description is required'),
  metaTitle_en: z.string().optional(),
  metaTitle_ar: z.string().optional(),
  metaDescription_en: z.string().optional(),
  metaDescription_ar: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  categoryId: z.string().min(1, 'Category is required'),
  productTypeId: z.string().min(1, 'Product type is required'),
  images: z.array(z.instanceof(File)).min(1, 'At least one image is required'),
  variations: z.array(z.object({
    sku: z.string().min(1, 'SKU is required'),
    barcode: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    previousPrice: z.number().optional(),
    stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
    weight: z.number().optional(),
    sizeId: z.string().optional(),
    colorId: z.string().optional(),
    boxColorId: z.string().optional(),
    usedFlowers: z.array(z.string()).optional(),
    isDefault: z.boolean(),
    dimension: z.object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    }).optional(),
    image: z.instanceof(File).optional(),
  })).min(1, 'At least one variation is required'),
  tagIds: z.array(z.string()).optional(),
  addonIds: z.array(z.string()).optional(),
})

export type ProductFormData = z.infer<typeof productSchema>