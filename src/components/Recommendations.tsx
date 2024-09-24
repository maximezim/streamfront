import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface RecommendationItem {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface RecommendationsProps {
  items: RecommendationItem[];
}

export function Recommendations({ items }: RecommendationsProps) {
  return (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <div className="text-center">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-auto mb-2" />
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}