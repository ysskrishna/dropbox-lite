"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import config from '@/common/config';
import { ALLOWED_FILE_TYPES, FILE_TYPE_MAP } from "@/common/fileutils";

export function UploadButton() {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.log("file.type", file.type);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Please upload one of these formats: ${Object.values(FILE_TYPE_MAP).join(", ")}`,
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${config.baseUrl}/api/file/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      toast({
        title: "Success",
        description: "File uploaded successfully",
      })

      // Refresh the page to show new file
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file. Please try again.",
      })
    } finally {
      setUploading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Select file ({Object.values(FILE_TYPE_MAP).join(", ")})</Label>
            <Input
              id="file"
              type="file"
              accept={Object.values(FILE_TYPE_MAP).join(",")}
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
          {uploading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

