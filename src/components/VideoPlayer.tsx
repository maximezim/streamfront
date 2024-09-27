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
    
    <AspectRatio ratio={16 / 9} className="h-full">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="h-full object-cover rounded-md"
      />
    </AspectRatio>
   
  )
}

export default VideoPlayer