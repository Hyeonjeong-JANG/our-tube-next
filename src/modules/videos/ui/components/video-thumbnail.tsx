import Image from "next/image";

interface VideoThumbnailProps {
  imageUrl?: string | null; // 영상이 아직 준비되지 않았거나 처리하지 않은 경우 작동하지 않을 수 있기 때문에 선택사항으로 했음
}

export const VideoThumbnail = ({ imageUrl }: VideoThumbnailProps) => {
  return (
    <div className="relative">
      {/* Thumbnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? "/placeholder.svg"}
          alt="Thumbnail"
          fill
          className="h-full w-full object-cover"
        />
      </div>
      {/* Video duration box */}
      {/* TODO: Video duration box */}
    </div>
  );
};
