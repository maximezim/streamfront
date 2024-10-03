
interface StreamItem {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
}

interface StreamItemsProps {
    items: StreamItem[];
}


export function Streams({ items }: StreamItemsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div className="flex aspect-video flex-col gap-2">
            <div className="overflow-hidden rounded-md relative">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-auto" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs p-1 rounded">
                    1,234 views • 1 day ago
                </div>
            </div>
            <div className="flex gap-4 mt-2">
                <div className="h-12 w-12 bg-gray-600 rounded-full mr-4"></div>
                <div className="flex flex-col">
                    <p className="text-lg font-semibold">{item.title}</p>
                    <h3 className="text-base italic ">{item.channel}</h3>
                </div>
            </div>
        </div>
      ))}
    </div>
  )
}