import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface RecommendationItem {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
}

interface RecommendationsScrollAreaProps {
  items: RecommendationItem[];
}

export function RecommendationsScroll({ items }: RecommendationsScrollAreaProps) {
  return (
    <ScrollArea className="mx-4 overflow-x-auto border rounded-md my-4 p-4">
      <div className="flex space-x-4">
        {items.length > 0 ? (
          items.map((item) => (
            <figure key={item.id} className="shrink-0">
              <div className="overflow-hidden rounded-md relative">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="aspect-video h-40 w-64 object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs p-1 rounded">
                  1,234 views • 1 day ago
                </div>
              </div>
              <figcaption className="flex items-center justify-between pt-2 text-sm">
                <div className="h-9 w-9 bg-gray-300 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="font-semibold text-base">{item.title}</div>
                  <div className="text-gray-500 text-sm">{item.channel}</div>
                </div>
              </figcaption>
            </figure>
          ))
        ) : (
          <div className="text-center py-8 w-full">
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No recommendations available at the moment.
            </p>
          </div>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
