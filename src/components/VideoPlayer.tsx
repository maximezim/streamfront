import { AspectRatio } from "@/components/ui/aspect-ratio"

interface VideoPlayerProps {
  video: {
    id: number;
    title: string;
    channel: string;
    thumbnailUrl: string;
  }
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <>
    <AspectRatio ratio={16 / 9} className="h-full">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="h-full object-cover rounded-md"
      />
    </AspectRatio>
    <p>{video.id}</p></>
   
  )
}

export default VideoPlayer