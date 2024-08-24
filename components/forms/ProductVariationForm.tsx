// components/forms/product-variation-form.tsx
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ProductVariationFormProps {
  index: number
  onRemove: () => void
}

export function ProductVariationForm({ index, onRemove }: ProductVariationFormProps) {
  const { register } = useFormContext()

  return (
    <div className="border p-4 rounded-md mb-4">
      <h3 className="text-lg font-semibold mb-2">Variation {index + 1}</h3>
      <Input
        {...register(`variations.${index}.sku`)}
        placeholder="SKU"
        className="mb-2"
      />
      <Input
        {...register(`variations.${index}.price`)}
        type="number"
        placeholder="Price"
        className="mb-2"
      />
      {/* Add other variation fields */}
      <Button onClick={onRemove} variant="destructive">Remove Variation</Button>
    </div>
  )
}