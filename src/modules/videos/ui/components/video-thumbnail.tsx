import Image from "next/image";

interface VideoThumbnailProps {
  title: string;
  imageUrl?: string | null; // 영상이 아직 준비되지 않았거나 처리하지 않은 경우 작동하지 않을 수 있기 때문에 선택사항으로 했음
  previewUrl?: string | null;
}

export const VideoThumbnail = ({
  title,
  imageUrl,
  previewUrl,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      {/* Thumbnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? "/placeholder.svg"}
          alt="Thumbnail"
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl ?? "/placeholder.svg"}
          alt="Preview"
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      {/* Video duration box */}
      {/* TODO: Video duration box */}
    </div>
  );
};
