import { AspectRatio } from "@/components/ui/aspect-ratio"

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
  }
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <div className="w-full h-full">
      <AspectRatio ratio={16 / 9} className="h-full">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover rounded-md"
        />
      </AspectRatio>
    </div>
  )
}

export default VideoPlayer