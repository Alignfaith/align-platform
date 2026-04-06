import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  buffer: Buffer,
  options: { folder: string; publicId?: string }
): Promise<{ url: string; publicId: string }> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.')
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: 'image',
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'))
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return
  await cloudinary.uploader.destroy(publicId)
}
