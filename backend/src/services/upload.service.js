import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

// Multer memory storage for direct buffer uploads to Cloudinary
export const upload = multer({ storage: multer.memoryStorage() });

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export async function uploadBufferToCloudinary(buffer, filename, folder = 'findmystuff') {
  return new Promise((resolve, reject) => {
    const passthrough = new stream.PassThrough();
    passthrough.end(buffer);
    const options = { folder, public_id: filename?.split('.')?.[0] };
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    passthrough.pipe(uploadStream);
  });
}


