"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface FileViewProps {
  params: {
    id: string
  }
}

export default function FileView({ params }: FileViewProps) {
  const [file, setFile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFile()
  }, [])

  const fetchFile = async () => {
    try {
      const response = await fetch(`/api/file/download/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch file")

      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("image")) {
        const blob = await response.blob()
        setFile({
          type: "image",
          url: URL.createObjectURL(blob),
        })
      } else {
        const text = await response.text()
        setFile({
          type: "text",
          content: text,
        })
      }
    } catch (err) {
      setError("Failed to load file. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Files
          </Button>
        </Link>
        <a href={`/api/file/download/${params.id}`} download>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </a>
      </div>

      <div className="border rounded-lg p-4">
        {file.type === "image" ? (
          <div className="relative aspect-video">
            <Image src={file.url || "/placeholder.svg"} alt="File preview" fill className="object-contain" />
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm">{file.content}</pre>
        )}
      </div>
    </main>
  )
}

