import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
  }
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <div className="w-full">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      </AspectRatio>
      <div className="mt-2 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export default VideoPlayer