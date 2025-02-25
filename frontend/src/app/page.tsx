import { FileList } from "@/components/file-list"
import { UploadButton } from "@/components/upload-button"
import Image from "next/image"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-6xl ">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Dropbox Lite Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold">Dropbox Lite</h1>
        </div>
        <UploadButton />
      </div>
      <FileList />
    </main>
  )
}

