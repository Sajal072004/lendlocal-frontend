import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Item } from '@/lib/apiService';

export function ItemCard({ item }: { item: Item }) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Link href={`/item/${item._id}`}>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <Image
            src={item.photos?.[0] || '/profile-placeholder.jpeg'}
            alt={item.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          {item.availabilityStatus === 'borrowed' && (
            <Badge variant="destructive" className="absolute top-2 right-2">Borrowed</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold line-clamp-2">{item.name}</CardTitle>
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