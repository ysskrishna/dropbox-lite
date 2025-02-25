import { File } from "lucide-react"
import { getClassWithColor } from "file-icons-js"

export const ALLOWED_FILE_TYPES = ["text/plain", "image/jpeg", "image/png", "application/json", "application/pdf", "application/msword", "audio/mpeg", "video/mp4"]

export const FILE_TYPE_MAP: { [key: string]: string } = {
  // Text & Documents
  "text/plain": ".txt",
  "text/csv": ".csv",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  
  // Images
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  
  // Audio
  "audio/mpeg": ".mp3",
  
  // Video
  "video/mp4": ".mp4"
}

export const getFileIcon = (filename: string) => {
  const iconClass = getClassWithColor(filename);
  
  if (iconClass) {
    return (
      <i className={iconClass} />
    );
  }
  
  // Fallback to default file icon if no matching icon is found
  return <File className="h-4 w-4" />;
};