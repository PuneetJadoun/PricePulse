"use client";
 
import { deleteProduct } from "@/app/actions";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
  TrendingDown,
  ImageOff
} from "lucide-react";
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import PriceChart from "./PriceChart";
 
const ProductCard = ({ product }) => {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
 
  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;
 
    setDeleting(true);
 
    try {
      const result = await deleteProduct(product.id);
 
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Product deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };
 
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          <div 
            className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center relative"
            style={product.image_url && !imageError ? {
                backgroundImage: `url(${product.image_url})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            } : {}}
          >
            {(!product.image_url || imageError) && (
              <div className="flex flex-col items-center justify-center text-gray-400 gap-1 text-center p-2">
                <ImageOff className="w-6 h-6" />
                <span className="text-[8px] uppercase font-semibold">
                   No Image
                </span>
              </div>
            )}
            
            {/* Hidden img tag just to detect errors */}
            {product.image_url && !imageError && (
                <img 
                    src={product.image_url} 
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="hidden"
                />
            )}
          </div>
 
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
              {product.name}
            </h3>
 
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">
                {product.currency} {product.current_price}
              </span>
 
              <Badge variant="secondary" className="gap-1 bg-orange-50 text-orange-700 border-orange-100">
                <TrendingDown className="w-3 h-3" />
                Tracking
              </Badge>
            </div>
            
            {imageError && (
               <p className="text-[10px] text-gray-400 truncate mt-1">
                 Error loading image from source.
               </p>
            )}
          </div>
        </div>
      </CardHeader>
 
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChart(!showChart)}
            className="gap-1 h-9"
          >
            {showChart ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Chart
              </>
            )}
          </Button>
 
          <Button variant="outline" size="sm" asChild className="gap-1 h-9">
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              View Product
            </Link>
          </Button>
 
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 h-9 ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        </div>
      </CardContent>
 
      {showChart && (
        <CardFooter className="pt-0 border-t mt-4 bg-gray-50/50">
          <PriceChart productId={product.id} />
        </CardFooter>
      )}
    </Card>
  );
};
 
export default ProductCard;