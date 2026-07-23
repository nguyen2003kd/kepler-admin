"use client"

import React, { useState, useCallback } from 'react'
import { toast } from '@/components/ui/toaster'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImagePicker, type ImagePickerFile } from '@/components/shared/image-picker'
import { RichTextEditor } from '@/components/shared/rich-text-editor'
import { Image as ImageIcon, Type, Plus, X, Upload } from 'lucide-react'
import baseConfig from "@configs/base";
import Can from '@/acl/Can';
export interface PostContentImage {
  position: number
  file_id: string
  file?: ImagePickerFile
}

export interface PostContentSection {
  id: string
  type: 'text' | 'image'
  position: number
  content?: string
  image_columns?: number
  image_rows?: number
  post_content_images?: PostContentImage[]
  caption?: string
}

interface PostContentEditorProps {
  sections: PostContentSection[]
  onSectionsChange: (sections: PostContentSection[]) => void
}

export const PostContentEditor: React.FC<PostContentEditorProps> = ({
  sections,
  onSectionsChange
}) => {
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [currentImageSection, setCurrentImageSection] = useState<string | null>(null)
  const [currentImagePosition, setCurrentImagePosition] = useState<number>(0)

  const addSection = (type: 'text' | 'image') => {
    const newSection: PostContentSection = {
      id: `section-${Date.now()}`,
      type,
      position: sections.length + 1,
      ...(type === 'text' 
        ? { content: '' }
        : { 
            image_columns: 2, 
            image_rows: 2, 
            post_content_images: [],
            caption: ''
          }
      )
    }
    onSectionsChange([...sections, newSection])
  }

  const updateSection = useCallback((id: string, updates: Partial<PostContentSection>) => {
    onSectionsChange(
      sections.map(section => 
        section.id === id ? { ...section, ...updates } : section
      )
    )
  }, [sections, onSectionsChange])

  const handleContentChange = useCallback((sectionId: string, content: string) => {
    // Only update if content actually changed
    const currentSection = sections.find(s => s.id === sectionId)
    if (currentSection && currentSection.content !== content) {
      updateSection(sectionId, { content })
    }
  }, [sections, updateSection])

  const removeSection = (id: string) => {
    const filteredSections = sections.filter(section => section.id !== id)
    // Reorder positions
    const reorderedSections = filteredSections.map((section, index) => ({
      ...section,
      position: index + 1
    }))
    onSectionsChange(reorderedSections)
  }

  const addImageToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section || section.type !== 'image') return

    const maxColumns = section.image_columns || 2
    const maxRows = section.image_rows || 2
    const maxImages = maxColumns * maxRows
    const currentImages = section.post_content_images || []
    
    if (currentImages.length >= maxImages) {
      toast.warning({ title: 'Giới hạn ảnh', content: `Chỉ có thể thêm tối đa ${maxImages} ảnh (${maxColumns}x${maxRows})` })
      return
    }

    setCurrentImageSection(sectionId)
    setCurrentImagePosition(currentImages.length + 1)
    setShowImagePicker(true)
  }

  const handleImageSelect = (file: ImagePickerFile) => {
    if (!currentImageSection) return

    const section = sections.find(s => s.id === currentImageSection)
    if (!section || section.type !== 'image') return

    const newImage: PostContentImage = {
      position: currentImagePosition,
      file_id: file.id,
      file
    }

    const updatedImages = [...(section.post_content_images || []), newImage]
    updateSection(currentImageSection, { post_content_images: updatedImages })
    
    setShowImagePicker(false)
    setCurrentImageSection(null)
    setCurrentImagePosition(0)
  }

  const removeImageFromSection = (sectionId: string, imagePosition: number) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section || section.type !== 'image') return

    const updatedImages = section.post_content_images?.filter(img => img.position !== imagePosition) || []
    // Reorder positions
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      position: index + 1
    }))
    
    updateSection(sectionId, { post_content_images: reorderedImages })
  }

  const updateImageGrid = (sectionId: string, columns: number, rows: number) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section || section.type !== 'image') return

    const maxImages = columns * rows
    let images = section.post_content_images || []
    
    // If reducing grid size, trim excess images
    if (images.length > maxImages) {
      images = images.slice(0, maxImages)
    }

    updateSection(sectionId, { 
      image_columns: columns, 
      image_rows: rows,
      post_content_images: images
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium">Nội dung tin tức</Label>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">Chưa có nội dung nào</p>
          <div className="flex justify-center gap-2">
            <Can I="add_text_section" a="news">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => addSection('text')}
            >
              <Type className="h-4 w-4 mr-2" />
              Thêm văn bản
            </Button>
              </Can>
            <Can I="add_image_section" a="news">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => addSection('image')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Thêm hình ảnh
            </Button>
            </Can>
          </div>
        </div>
      )}

      {sections.map((section) => (
        <Card key={section.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {section.type === 'text' ? (
                  <Type className="h-4 w-4 text-blue-600" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-green-600" />
                )}
                <CardTitle className="text-base">
                  {section.type === 'text' ? 'Văn bản' : 'Hình ảnh'} - Section {section.position}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {section.type === 'text' ? 'Text' : 'Images'}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(section.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {section.type === 'text' ? (
              <div className="space-y-2">
                <Label>Nội dung văn bản</Label>
                <RichTextEditor
                  value={section.content || ''}
                  onChange={(value) => handleContentChange(section.id, value)}
                  placeholder="Nhập nội dung văn bản..."
                  className="min-h-[200px]"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Grid Configuration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số cột ảnh</Label>
                    <Select 
                      value={String(section.image_columns || 2)}
                      onValueChange={(value) => updateImageGrid(section.id, parseInt(value), section.image_rows || 2)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 cột</SelectItem>
                        <SelectItem value="2">2 cột</SelectItem>
                        <SelectItem value="3">3 cột</SelectItem>
                        <SelectItem value="4">4 cột</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Số hàng ảnh</Label>
                    <Select 
                      value={String(section.image_rows || 2)}
                      onValueChange={(value) => updateImageGrid(section.id, section.image_columns || 2, parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hàng</SelectItem>
                        <SelectItem value="2">2 hàng</SelectItem>
                        <SelectItem value="3">3 hàng</SelectItem>
                        <SelectItem value="4">4 hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Caption */}
                {/* <div className="space-y-2">
                  <Label>Mô tả (tùy chọn)</Label>
                  <Input
                    value={section.caption || ''}
                    onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                    placeholder="Mô tả cho nhóm ảnh..."
                  />
                </div> */}

                {/* Image Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Hình ảnh ({(section.post_content_images || []).length}/{(section.image_columns || 2) * (section.image_rows || 2)})</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addImageToSection(section.id)}
                      disabled={(section.post_content_images || []).length >= (section.image_columns || 2) * (section.image_rows || 2)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm ảnh
                    </Button>
                  </div>
                  
                  <div 
                    className="grid gap-2 border rounded-lg p-4 bg-gray-50"
                    style={{
                      gridTemplateColumns: `repeat(${section.image_columns || 2}, 1fr)`,
                      minHeight: '200px'
                    }}
                  >
                    {Array.from({ length: (section.image_columns || 2) * (section.image_rows || 2) }).map((_, index) => {
                      const image = section.post_content_images?.find(img => img.position === index + 1)
                      return (
                        <div
                          key={index}
                          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative group cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                          onClick={() => {
                            if (!image) {
                              setCurrentImageSection(section.id)
                              setCurrentImagePosition(index + 1)
                              setShowImagePicker(true)
                            }
                          }}
                        >
                          {image?.file ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={`${baseConfig.imgEndpointDomain}${image.file.path || image.file.compress_info?.desktop || ''}`}
                                alt={`Ảnh ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <button
                                type="button"
                                onClick={() => removeImageFromSection(section.id, image.position)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center pointer-events-none">
                              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1 group-hover:text-blue-500" />
                              <span className="text-xs text-gray-500 group-hover:text-blue-600">Nhấn để chọn ảnh {index + 1}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => {
          setShowImagePicker(false)
          setCurrentImageSection(null)
          setCurrentImagePosition(0)
        }}
        onSelect={handleImageSelect}
        type="image"
      />
        <div className="flex gap-2 items-center justify-center">
          <Can I="add_text_section" a="news">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => addSection('text')}
            >
              <Type className="h-4 w-4 mr-2" />
              Thêm Section Văn bản
            </Button>
          </Can>
          <Can I="add_image_section" a="news">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => addSection('image')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Thêm Section Hình ảnh
            </Button>
          </Can>
        </div>
    </div>
  )
}