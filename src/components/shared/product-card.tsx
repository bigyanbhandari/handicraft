"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? calculateDiscount(product.price, product.discountPrice!) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/jewelry/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm mb-3">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
          {hasDiscount && (
            <Badge variant="sale" className="absolute top-3 left-3">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.stockStatus === "Limited Stock" && (
            <Badge variant="limited" className="absolute top-3 right-3">
              Limited
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <div className="space-y-1">
          {product.category && (
            <p className="text-[10px] tracking-widest uppercase text-[#C9A84C] font-medium">
              {product.category.title}
            </p>
          )}
          <h3 className="text-sm font-medium text-neutral-900 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
            {product.title}
          </h3>
          {product.craftType && (
            <p className="text-[11px] text-neutral-500">{product.craftType}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-neutral-900">
              {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
