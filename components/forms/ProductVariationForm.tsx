import { useState } from 'react'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ProductVariation } from '@/types/types'
import { Plus, Trash2 } from 'lucide-react'

const variationSchema = z.object({
  variations: z.array(
    z.object({
      sku: z.string().min(1, 'SKU is required'),
      price: z.number().min(0, 'Price must be positive'),
    })
  ),
})

type VariationFormData = z.infer<typeof variationSchema>

interface ProductVariationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (variations: ProductVariation[]) => void
  initialVariations?: ProductVariation[]
}

export function ProductVariationsDialog({
  open,
  onOpenChange,
  onSave,
  initialVariations = [],
}: ProductVariationsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<VariationFormData>({
    resolver: zodResolver(variationSchema),
    defaultValues: {
      variations: initialVariations.length > 0 ? initialVariations : [{ sku: '', price: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  })

  const onSubmit = (data: VariationFormData) => {
    setIsSubmitting(true);
    const transformedVariations: ProductVariation[] = data.variations.map((variation, index) => ({
      id: index.toString(), // or generate a unique ID
      name: variation.sku, // or leave it empty if not needed
      ...variation
    }));
    onSave(transformedVariations);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Product Variations</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Controller
                        name={`variations.${index}.sku`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input {...field} placeholder="SKU" />
                            {errors.variations?.[index]?.sku && (
                              <p className="text-sm text-destructive mt-1">
                                {errors.variations[index]?.sku?.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`variations.${index}.price`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                            {errors.variations?.[index]?.price && (
                              <p className="text-sm text-destructive mt-1">
                                {errors.variations[index]?.price?.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove variation</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="mt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ sku: '', price: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variation
            </Button>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Variations'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}