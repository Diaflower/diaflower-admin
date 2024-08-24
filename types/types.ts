import { Item } from "@radix-ui/react-dropdown-menu";

export interface Image {
  id: number;
  url: string;
  altText_en?: string;
  altText_ar?: string;
}

export interface Item {
  id: number;
  name_en?: string;
  name_ar?: string;
  color?: string;
  image?: Image;
}

  export type ItemType = 'categories' | 'tags' | 'productTypes' | 'sizes' | 'infinityColors' | 'boxColors' | 'usedFlowers';

 