'use client'

// artwork management client component
// handles crud operations for portfolio artworks with cloudinary uploads

import { useState, useCallback, FormEvent } from 'react'
import useSWR, { mutate } from 'swr'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import ModalClose from '@mui/joy/ModalClose'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Textarea from '@mui/joy/Textarea'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Checkbox from '@mui/joy/Checkbox'
import CircularProgress from '@mui/joy/CircularProgress'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Chip from '@mui/joy/Chip'
import AspectRatio from '@mui/joy/AspectRatio'
import Skeleton from '@mui/joy/Skeleton'
import Stack from '@mui/joy/Stack'
import Divider from '@mui/joy/Divider'
import Add from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import CloudUpload from '@mui/icons-material/CloudUpload'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import type { Artwork, MediaType, ArtworkInsert, ArtworkUpdate } from '@/lib/supabase/types'
import Link from 'next/link'

// swr fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'failed to fetch')
  }
  const data = await res.json()
  return data.data
}

// media type options for dropdown
const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'model_3d', label: '3D Model' },
  { value: 'gif', label: 'GIF' },
]

// form data type for artwork creation/editing
interface ArtworkFormData {
  title: string
  description: string
  long_description: string
  media_type: MediaType
  materials: string
  dimensions: string
  year_created: string
  is_for_sale: boolean
  shop_url: string
  price_range: string
  cloudinary_public_id: string
  cloudinary_url: string
  thumbnail_url: string
}

// initial empty form state
const emptyFormData: ArtworkFormData = {
  title: '',
  description: '',
  long_description: '',
  media_type: 'image',
  materials: '',
  dimensions: '',
  year_created: '',
  is_for_sale: false,
  shop_url: '',
  price_range: '',
  cloudinary_public_id: '',
  cloudinary_url: '',
  thumbnail_url: '',
}

interface ArtworkManagerProps {
  initialArtworks: Artwork[]
}

export function ArtworkManager({ initialArtworks }: ArtworkManagerProps) {
  // swr for data fetching with initial data from server
  const { data: artworks, error: fetchError, isLoading } = useSWR<Artwork[]>(
    '/api/artworks',
    fetcher,
    { fallbackData: initialArtworks }
  )

  // modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)
  const [deletingArtwork, setDeletingArtwork] = useState<Artwork | null>(null)

  // form state
  const [formData, setFormData] = useState<ArtworkFormData>(emptyFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // open form modal for creating new artwork
  const handleAddNew = useCallback(() => {
    setEditingArtwork(null)
    setFormData(emptyFormData)
    setFormError(null)
    setIsFormModalOpen(true)
  }, [])

  // open form modal for editing existing artwork
  const handleEdit = useCallback((artwork: Artwork) => {
    setEditingArtwork(artwork)
    setFormData({
      title: artwork.title,
      description: artwork.description || '',
      long_description: artwork.long_description || '',
      media_type: artwork.media_type,
      materials: artwork.materials || '',
      dimensions: artwork.dimensions || '',
      year_created: artwork.year_created?.toString() || '',
      is_for_sale: artwork.is_for_sale,
      shop_url: artwork.shop_url || '',
      price_range: artwork.price_range || '',
      cloudinary_public_id: artwork.cloudinary_public_id || '',
      cloudinary_url: artwork.cloudinary_url || '',
      thumbnail_url: artwork.thumbnail_url || '',
    })
    setFormError(null)
    setIsFormModalOpen(true)
  }, [])

  // open delete confirmation modal
  const handleDeleteClick = useCallback((artwork: Artwork) => {
    setDeletingArtwork(artwork)
    setIsDeleteModalOpen(true)
  }, [])

  // close form modal
  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false)
    setEditingArtwork(null)
    setFormData(emptyFormData)
    setFormError(null)
  }, [])

  // close delete modal
  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setDeletingArtwork(null)
  }, [])

  // handle cloudinary upload success
  const handleUploadSuccess = useCallback((result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== 'string') {
      setFormData((prev) => ({
        ...prev,
        cloudinary_public_id: result.info && typeof result.info !== 'string' ? result.info.public_id : '',
        cloudinary_url: result.info && typeof result.info !== 'string' ? result.info.secure_url : '',
        thumbnail_url: result.info && typeof result.info !== 'string'
          ? result.info.secure_url.replace('/upload/', '/upload/c_thumb,w_300,h_300/')
          : '',
      }))
    }
  }, [])

  // handle form input changes
  const handleInputChange = useCallback((
    field: keyof ArtworkFormData,
    value: string | boolean | MediaType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // submit form for create or update
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    try {
      // validate required fields
      if (!formData.title.trim()) {
        throw new Error('title is required')
      }

      // build request payload
      const payload: ArtworkInsert | ArtworkUpdate = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        long_description: formData.long_description.trim() || null,
        media_type: formData.media_type,
        materials: formData.materials.trim() || null,
        dimensions: formData.dimensions.trim() || null,
        year_created: formData.year_created ? parseInt(formData.year_created, 10) : null,
        is_for_sale: formData.is_for_sale,
        shop_url: formData.shop_url.trim() || null,
        price_range: formData.price_range.trim() || null,
        cloudinary_public_id: formData.cloudinary_public_id || null,
        cloudinary_url: formData.cloudinary_url || null,
        thumbnail_url: formData.thumbnail_url || null,
      }

      let response: Response

      if (editingArtwork) {
        // update existing artwork
        response = await fetch(`/api/artworks/${editingArtwork.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        // create new artwork
        response = await fetch('/api/artworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'failed to save artwork')
      }

      // revalidate swr cache
      await mutate('/api/artworks')

      // show success message and close modal
      setSuccessMessage(editingArtwork ? 'artwork updated successfully' : 'artwork created successfully')
      handleCloseFormModal()

      // clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'an error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, editingArtwork, handleCloseFormModal])

  // confirm and execute delete
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingArtwork) return

    setIsSubmitting(true)
    setFormError(null)

    try {
      const response = await fetch(`/api/artworks/${deletingArtwork.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'failed to delete artwork')
      }

      // revalidate swr cache
      await mutate('/api/artworks')

      setSuccessMessage('artwork deleted successfully')
      handleCloseDeleteModal()

      // clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'an error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }, [deletingArtwork, handleCloseDeleteModal])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        p: { xs: 2, md: 4 },
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            component={Link}
            href="/admin"
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': { borderColor: 'rgba(255,255,255,0.5)' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography level="h2" sx={{ color: 'white', fontWeight: 300 }}>
            Artwork Management
          </Typography>
        </Box>
        <Button
          startDecorator={<Add />}
          onClick={handleAddNew}
          sx={{
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          Add Artwork
        </Button>
      </Box>

      {/* success message */}
      {successMessage && (
        <Alert color="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* error message */}
      {fetchError && (
        <Alert color="danger" sx={{ mb: 2 }}>
          failed to load artworks: {fetchError.message}
        </Alert>
      )}

      {/* artworks table */}
      <Card
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <Sheet
          sx={{
            overflow: 'auto',
            backgroundColor: 'transparent',
          }}
        >
          {isLoading ? (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table
              sx={{
                '& th': {
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                },
                '& td': {
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Thumbnail</th>
                  <th>Title</th>
                  <th style={{ width: 100 }}>Media Type</th>
                  <th style={{ width: 100 }}>For Sale</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks && artworks.length > 0 ? (
                  artworks.map((artwork) => (
                    <tr key={artwork.id}>
                      <td>
                        <AspectRatio ratio="1" sx={{ width: 60, borderRadius: 'sm' }}>
                          {artwork.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={artwork.thumbnail_url}
                              alt={artwork.title}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <Skeleton variant="overlay" />
                          )}
                        </AspectRatio>
                      </td>
                      <td>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {artwork.title}
                        </Typography>
                        {artwork.description && (
                          <Typography
                            level="body-xs"
                            sx={{
                              color: 'rgba(255,255,255,0.5)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 300,
                            }}
                          >
                            {artwork.description}
                          </Typography>
                        )}
                      </td>
                      <td>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={
                            artwork.media_type === 'image'
                              ? 'primary'
                              : artwork.media_type === 'video'
                                ? 'warning'
                                : artwork.media_type === 'model_3d'
                                  ? 'success'
                                  : 'neutral'
                          }
                        >
                          {artwork.media_type}
                        </Chip>
                      </td>
                      <td>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={artwork.is_for_sale ? 'success' : 'neutral'}
                        >
                          {artwork.is_for_sale ? 'Yes' : 'No'}
                        </Chip>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="primary"
                            onClick={() => handleEdit(artwork)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => handleDeleteClick(artwork)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <Typography
                        level="body-md"
                        sx={{ textAlign: 'center', py: 4, color: 'rgba(255,255,255,0.5)' }}
                      >
                        no artworks found. click &quot;add artwork&quot; to create one.
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Sheet>
      </Card>

      {/* create/edit modal */}
      <Modal open={isFormModalOpen} onClose={handleCloseFormModal}>
        <ModalDialog
          size="lg"
          sx={{
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <ModalClose sx={{ color: 'rgba(255,255,255,0.7)' }} />
          <DialogTitle sx={{ color: 'white' }}>
            {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {formError && (
                  <Alert color="danger" size="sm">
                    {formError}
                  </Alert>
                )}

                {/* title */}
                <FormControl required>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="artwork title"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    }}
                  />
                </FormControl>

                {/* description */}
                <FormControl>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Short Description</FormLabel>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="brief description for previews"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    }}
                  />
                </FormControl>

                {/* long description */}
                <FormControl>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Long Description</FormLabel>
                  <Textarea
                    value={formData.long_description}
                    onChange={(e) => handleInputChange('long_description', e.target.value)}
                    placeholder="detailed description for artwork detail page"
                    minRows={3}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    }}
                  />
                </FormControl>

                {/* media type */}
                <FormControl required>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Media Type</FormLabel>
                  <Select
                    value={formData.media_type}
                    onChange={(_, value) => value && handleInputChange('media_type', value)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                    }}
                  >
                    {MEDIA_TYPES.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </FormControl>

                {/* cloudinary upload */}
                <FormControl>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Image/Media</FormLabel>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {formData.thumbnail_url && (
                      <AspectRatio ratio="1" sx={{ width: 80, borderRadius: 'sm', flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.thumbnail_url}
                          alt="preview"
                          style={{ objectFit: 'cover' }}
                        />
                      </AspectRatio>
                    )}
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={handleUploadSuccess}
                      options={{
                        maxFiles: 1,
                        resourceType: 'auto',
                        folder: 'art-portfolio',
                      }}
                    >
                      {({ open }) => (
                        <Button
                          variant="outlined"
                          color="neutral"
                          startDecorator={<CloudUpload />}
                          onClick={() => open()}
                          sx={{
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            '&:hover': { borderColor: 'rgba(255,255,255,0.5)' },
                          }}
                        >
                          {formData.cloudinary_url ? 'Replace Image' : 'Upload Image'}
                        </Button>
                      )}
                    </CldUploadWidget>
                  </Box>
                </FormControl>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* materials */}
                <FormControl>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Materials</FormLabel>
                  <Input
                    value={formData.materials}
                    onChange={(e) => handleInputChange('materials', e.target.value)}
                    placeholder="e.g. oil on canvas, digital, clay"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    }}
                  />
                </FormControl>

                {/* dimensions */}
                <FormControl>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Dimensions</FormLabel>
                  <Input
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    placeholder="e.g. 24x36 inches, 1920x1080px"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    }}
                  />
                </FormControl>

                {/* year created */}
                <FormControl>
                  <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Year Created</FormLabel>
                  <Input
                    type="number"
                    value={formData.year_created}
                    onChange={(e) => handleInputChange('year_created', e.target.value)}
                    placeholder="e.g. 2024"
                    slotProps={{
                      input: { min: 1900, max: new Date().getFullYear() + 1 },
                    }}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    }}
                  />
                </FormControl>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* for sale checkbox */}
                <FormControl>
                  <Checkbox
                    checked={formData.is_for_sale}
                    onChange={(e) => handleInputChange('is_for_sale', e.target.checked)}
                    label="Available for Sale"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '& .MuiCheckbox-checkbox': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  />
                </FormControl>

                {/* shop url - only shown if for sale */}
                {formData.is_for_sale && (
                  <>
                    <FormControl>
                      <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Shop URL</FormLabel>
                      <Input
                        type="url"
                        value={formData.shop_url}
                        onChange={(e) => handleInputChange('shop_url', e.target.value)}
                        placeholder="https://shop.example.com/artwork"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                        }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Price Range</FormLabel>
                      <Input
                        value={formData.price_range}
                        onChange={(e) => handleInputChange('price_range', e.target.value)}
                        placeholder="e.g. $100-$500, Contact for pricing"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                        }}
                      />
                    </FormControl>
                  </>
                )}

                {/* submit buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={handleCloseFormModal}
                    disabled={isSubmitting}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    sx={{
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
                      },
                    }}
                  >
                    {editingArtwork ? 'Save Changes' : 'Create Artwork'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* delete confirmation modal */}
      <Modal open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <DialogTitle sx={{ color: 'white' }}>
            Delete Artwork
          </DialogTitle>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <DialogContent sx={{ color: 'rgba(255,255,255,0.7)' }}>
            are you sure you want to delete &quot;{deletingArtwork?.title}&quot;? this action cannot be undone.
          </DialogContent>
          {formError && (
            <Alert color="danger" size="sm" sx={{ mx: 2 }}>
              {formError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={handleCloseDeleteModal}
              disabled={isSubmitting}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              loading={isSubmitting}
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  )
}
