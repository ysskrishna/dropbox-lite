import {
  File,
  FileImage,
  FileText,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
} from "lucide-react"

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
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Image files
  if (['jpg', 'jpeg', 'png'].includes(extension)) {
    return <FileImage className="h-4 w-4" />;
  }
  
  // Document files
  if (['doc'].includes(extension)) {
    return <FileText className="h-4 w-4" />;
  }
  
  // Spreadsheet files
  if (['csv'].includes(extension)) {
    return <FileSpreadsheet className="h-4 w-4" />;
  }
  
  // PDF files
  if (['pdf'].includes(extension)) {
    return <File className="h-4 w-4" />;
  }
  
  // Video files
  if (['mp4'].includes(extension)) {
    return <FileVideo className="h-4 w-4" />;
  }
  
  // Audio files
  if (['mp3'].includes(extension)) {
    return <FileAudio className="h-4 w-4" />;
  }
  // Default file icon
  return <File className="h-4 w-4" />;
};