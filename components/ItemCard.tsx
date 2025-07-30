import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Item } from '@/lib/apiService';

export function ItemCard({ item }: { item: Item }) {
  const getInitials = (name: string) => { if(!name) return '';
    const names = name?.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Link href={`/item/${item._id}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="relative">
          <Image
            src={item.photos?.[0] || '/profile-placeholder.jpeg'}
            alt={item.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {item.availabilityStatus === 'borrowed' && (
            <Badge variant="destructive" className="absolute top-3 right-3">Borrowed</Badge>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">{item.name}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.owner.profilePicture} alt={item.owner.name} />
              <AvatarFallback>{getInitials(item.owner.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{item.owner.name}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}