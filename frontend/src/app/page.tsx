import { FileList } from "@/components/file-list"
import { UploadButton } from "@/components/upload-button"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-6xl ">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dropbox Lite</h1>
        <UploadButton />
      </div>
      <FileList />
    </main>
  )
}

