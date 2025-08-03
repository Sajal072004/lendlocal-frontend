import { Item } from "@/lib/apiService";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Package } from "lucide-react";

export function ItemSearchResult({ item }: { item: Item }) {
  return (
    <Link href={`/item/${item._id}`} className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-muted transition-colors">
      <Avatar className="h-12 w-12 border">
        <AvatarImage src={item.photos?.[0]} />
        <AvatarFallback><Package className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-muted-foreground">Item owned by {item.owner.name}</p>
      </div>
    </Link>
  );
}