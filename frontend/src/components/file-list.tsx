"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  Download,
  Loader2
} from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import config from '@/common/config';
import { getFileIcon } from "@/common/fileutils"

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
  const [sortField, setSortField] = useState<'name' | 'created_at'>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/api/file/list`)
      if (!response.ok) throw new Error("Failed to fetch files")
      const data = await response.json()
      setFiles(sortFiles(data, sortField, sortDirection))
    } catch (err) {
      setError("Failed to load files. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const sortFiles = (files: FileItem[], field: 'name' | 'created_at', direction: 'asc' | 'desc') => {
    return [...files].sort((a, b) => {
      const aValue = field === 'name' ? a[field].toLowerCase() : new Date(a[field] + 'Z').getTime()
      const bValue = field === 'name' ? b[field].toLowerCase() : new Date(b[field] + 'Z').getTime()
      return direction === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue > bValue ? -1 : 1
    })
  }

  const handleSort = (field: 'name' | 'created_at') => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(newDirection)
    setFiles(sortFiles(files, field, newDirection))
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
            <TableHead>
              <button
                onClick={() => handleSort('name')}
                className="flex items-center hover:text-gray-700"
              >
                Name
                {sortField === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button
                onClick={() => handleSort('created_at')}
                className="flex items-center hover:text-gray-700"
              >
                Date
                {sortField === 'created_at' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.name)}
                  {file.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(file.created_at + 'Z'), "PPP p")}
              </TableCell>
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

