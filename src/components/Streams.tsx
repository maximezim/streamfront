
interface StreamItem {
  id: number;
  title: string;
  channel: string;
  thumbnailUrl: string;
}

interface StreamItemsProps {
    items: StreamItem[];
    toStream: (id: number) => void;
}


export function Streams({ items, toStream }: StreamItemsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      {items.map((item) => (
        <div className="relative z-10 bg-white flex aspect-video flex-col cursor-pointer border-2 rounded-md border-slate-50 shadow-sm" onClick={() => toStream(item.id)}>
            <div className="overflow-hidden rounded-t-md relative">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-auto" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs p-1 rounded">
                    1,234 views • 1 day ago
                </div>
            </div>
            <div className="flex gap-4 p-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full mr-1 mt-1"></div>
                <div className="flex flex-col">
                    <p className="text-base font-semibold">{item.title}</p>
                    <h3 className="text-sm italic ">{item.channel}</h3>
                </div>
            </div>
        </div>
      ))}
    </div>
  )
}