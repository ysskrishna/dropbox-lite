"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Download, File, Loader2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import config from '@/common/config';

interface FileItem {
  id: number
  name: string
  path: string
  created_at: string
  updated_at: string
}

export function FileList() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/api/file/list`)
      if (!response.ok) throw new Error("Failed to fetch files")
      const data = await response.json()
      setFiles(data)
    } catch (err) {
      setError("Failed to load files. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  if (files.length === 0) {
    return <div className="text-center text-muted-foreground p-8">No files uploaded yet.</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  {file.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{format(new Date(file.created_at), "PPP")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <a href={`/api/file/download/${file.id}`} download>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

