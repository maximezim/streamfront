import { Card, CardContent } from "@/components/ui/card"

interface RecommendationItem {
  id: number;
  title: string;
  thumbnailUrl: string;
}

interface RecommendationsProps {
  items: RecommendationItem[];
}

export function Recommendations({ items }: RecommendationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex aspect-video items-center justify-center p-6">
            <div className="text-center">
              <img src={item.thumbnailUrl} alt={item.title} className="w-full h-auto mb-2" />
              <h3 className="text-sm font-semibold">{item.title}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}