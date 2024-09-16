'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

const API_BASE_URL = 'http://localhost:3001/api'

type ProductType = 'LONG_LIFE' | 'BOUQUET' | 'ARRANGEMENT' | 'ACRYLIC_BOX'
type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

interface Category {
  id: number
  name_en: string
  name_ar: string
}

interface ProductSize {
  id: number
  name_en: string
  name_ar: string
}

interface InfinityColor {
  id: number
  name_en: string
  name_ar: string
  color?: string
}

interface BoxColor {
  id: number
  name_en: string
  name_ar: string
  color?: string
}

interface WrappingColor {
  id: number
  name_en: string
  name_ar: string
  color?: string
}

interface ProductTag {
  id: number
  name_en: string
  name_ar: string
}

interface Addon {
  id: number
  name_en: string
  name_ar: string
}

const formSchema = z.object({
  code: z.string().optional(),
  name_en: z.string().min(2, 'Name (EN) is required'),
  name_ar: z.string().min(2, 'Name (AR) is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDescription_en: z.string().min(10, 'Short description (EN) is required'),
  shortDescription_ar: z.string().min(10, 'Short description (AR) is required'),
  longDescription_en: z.string().min(20, 'Long description (EN) is required'),
  longDescription_ar: z.string().min(20, 'Long description (AR) is required'),
  metaTitle_en: z.string().optional(),
  metaTitle_ar: z.string().optional(),
  metaDescription_en: z.string().optional(),
  metaDescription_ar: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  productType: z.enum(['LONG_LIFE', 'BOUQUET', 'ARRANGEMENT', 'ACRYLIC_BOX']),
  categoryId: z.number(),
  mainImage: z.any(),
  mainImageAltTextEn: z.string().optional(),
  mainImageAltTextAr: z.string().optional(),
  variations: z.array(z.object({
    sku: z.string(),
    barcode: z.string().optional(),
    price: z.number().min(0),
    previousPrice: z.number().min(0).optional(),
    inStock: z.boolean(),
    weight: z.number().optional(),
    sizeId: z.number().optional(),
    infinityColorId: z.number().optional(),
    boxColorId: z.number().optional(),
    wrappingColorId: z.number().optional(),
    isDefault: z.boolean(),
    image: z.any().optional(),
    imageAltTextEn: z.string().optional(),
    imageAltTextAr: z.string().optional(),
  })),
  tagIds: z.array(z.number()),
  addonIds: z.array(z.number()),
})

export default function ProductForm({ productId }: { productId?: number }) {
  const { getToken } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [sizes, setSizes] = useState<ProductSize[]>([])
  const [infinityColors, setInfinityColors] = useState<InfinityColor[]>([])
  const [boxColors, setBoxColors] = useState<BoxColor[]>([])
  const [wrappingColors, setWrappingColors] = useState<WrappingColor[]>([])
  const [tags, setTags] = useState<ProductTag[]>([])
  const [addons, setAddons] = useState<Addon[]>([])
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [variationImagePreviews, setVariationImagePreviews] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featured: false,
      status: 'DRAFT' as ProductStatus,
      productType: 'LONG_LIFE' as ProductType,
      variations: [{ sku: '', price: 0, inStock: true, isDefault: true }],
      tagIds: [],
      addonIds: [],
      categoryId: 0, // Set a default value to avoid NaN
    },
  })

  console.log("form erros",form.formState.errors)

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variations",
  })

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      if (!token) return

      const axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }

      try {
        const [
          categoriesRes,
          sizesRes,
          infinityColorsRes,
          boxColorsRes,
          wrappingColorsRes,
          tagsRes,
          addonsRes
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories/getAll`, axiosConfig),
          axios.get(`${API_BASE_URL}/productSizes/getAll`, axiosConfig),
          axios.get(`${API_BASE_URL}/infinitycolors/getAll`, axiosConfig),
          axios.get(`${API_BASE_URL}/boxcolors/getAll`, axiosConfig),
          axios.get(`${API_BASE_URL}/wrappingcolors/getAll`, axiosConfig),
          axios.get(`${API_BASE_URL}/tags/getAll`, axiosConfig),
          axios.get(`${API_BASE_URL}/addons/getAll`, axiosConfig)
        ])

        setCategories(categoriesRes.data.items)
        setSizes(sizesRes.data.items)
        setInfinityColors(infinityColorsRes.data.items)
        setBoxColors(boxColorsRes.data.items)
        setWrappingColors(wrappingColorsRes.data.items)
        setTags(tagsRes.data.items)
        setAddons(addonsRes.data.items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [getToken])

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const token = await getToken()
        if (!token) return

        try {
          const response = await axios.get(`${API_BASE_URL}/products/getById/${productId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const product = response.data
          console.log("product here",product)
          // Ensure price is a number and categoryId is correctly set
          product.variations = product.variations.map((variation: any) => ({
            ...variation,
            price: Number(variation.price),
            previousPrice: variation.previousPrice ? Number(variation.previousPrice) : undefined
          }))
          product.categoryId = Number(product.categoryId)
          form.reset(product)
          if (product.mainImage) {
            setMainImagePreview(product.mainImage.url)
          }
          setVariationImagePreviews(product.variations.map((v: any) => v.image?.url || ''))
        } catch (error) {
          console.error('Error fetching product:', error)
        }
      }
    }

    fetchProduct()
  }, [productId, getToken, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const token = await getToken()
    if (!token) return

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'variations' || key === 'tagIds' || key === 'addonIds') {
        formData.append(key, JSON.stringify(value))
      } else if (key === 'mainImage' && value instanceof File) {
        formData.append('mainImage', value)
      } else {
        formData.append(key, String(value))
      }
    })

    data.variations.forEach((variation, index) => {
      if (variation.image instanceof File) {
        formData.append(`variationImage`, variation.image)
      }
    })

    try {
      const url = productId
        ? `${API_BASE_URL}/products/update/${productId}`
        : `${API_BASE_URL}/products/create`

      const response = await axios({
        method: productId ? 'put' : 'post',
        url: url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200 || response.status === 201) {
        router.push('/products')
      } else {
        console.error('Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue('mainImage', file)
    }
  }

  const renderVariationFields = (index: number) => {
    const productType = form.watch('productType')
    const variation = form.watch(`variations.${index}`)

    return (
      <>
        <FormField
          control={form.control}
          name={`variations.${index}.sku`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`variations.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`variations.${index}.inStock`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">In Stock</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`variations.${index}.sizeId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size.id} value={size.id.toString()}>
                      {size.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {productType === 'LONG_LIFE' && (
          <>
            <FormField
              control={form.control}
              name={`variations.${index}.infinityColorId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Infinity Color</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an infinity color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {infinityColors.map((color) => (
                        <SelectItem key={color.id} value={color.id.toString()}>
                          {color.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variations.${index}.boxColorId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Box Color</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a box color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {boxColors.map((color) => (
                        <SelectItem key={color.id} value={color.id.toString()}>
                          {color.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {productType === 'BOUQUET' && (
          <FormField
            control={form.control}
            name={`variations.${index}.wrappingColorId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wrapping Color</FormLabel>
                <Select onValueChange={(value) =>field.onChange(parseInt(value))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a wrapping color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wrappingColors.map((color) => (
                      <SelectItem key={color.id} value={color.id.toString()}>
                        {color.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name={`variations.${index}.image`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variation Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      field.onChange(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setVariationImagePreviews(prev => {
                          const newPreviews = [...prev]
                          newPreviews[index] = reader.result as string
                          return newPreviews
                        })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </FormControl>
              {variationImagePreviews[index] && (
                <Image
                  src={variationImagePreviews[index]}
                  alt={`Variation ${index + 1}`}
                  width={100}
                  height={100}
                  className="mt-2"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (EN)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (AR)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description (EN)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description (AR)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longDescription_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description (EN)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longDescription_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description (AR)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LONG_LIFE">Long Life</SelectItem>
                      <SelectItem value="BOUQUET">Bouquet</SelectItem>
                      <SelectItem value="ARRANGEMENT">Arrangement</SelectItem>
                      <SelectItem value="ACRYLIC_BOX">Acrylic Box</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                    />
                  </FormControl>
                  {mainImagePreview && (
                    <Image
                      src={mainImagePreview}
                      alt="Main product image"
                      width={100}
                      height={100}
                      className="mt-2"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainImageAltTextEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Image Alt Text (EN)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainImageAltTextAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Image Alt Text (AR)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variations</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border rounded">
                <h4 className="text-lg font-semibold mb-2">Variation {index + 1}</h4>
                {renderVariationFields(index)}
                {index > 0 && (
                  <Button type="button" variant="destructive" onClick={() => remove(index)} className="mt-2">
                    Remove Variation
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ sku: '', price: 0, inStock: true, isDefault: false })}
              className="mt-2"
            >
              Add Variation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags and Addons</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="tagIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Tags</FormLabel>
                    <FormDescription>
                      Select the tags for this product
                    </FormDescription>
                  </div>
                  {tags.map((tag) => (
                    <FormField
                      key={tag.id}
                      control={form.control}
                      name="tagIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={tag.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, tag.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== tag.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {tag.name_en}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addonIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Addons</FormLabel>
                    <FormDescription>
                      Select the addons for this product
                    </FormDescription>
                  </div>
                  {addons.map((addon) => (
                    <FormField
                      key={addon.id}
                      control={form.control}
                      name="addonIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={addon.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(addon.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, addon.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== addon.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {addon.name_en}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit">Save Product</Button>
      </form>
    </Form>
  )
}