import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

export const cloudinaryConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET,
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload a base64 data URL to Cloudinary. When not configured, the original
 * data URL is returned so the app remains fully functional in mock mode.
 */
export async function uploadImage(
  dataUrl: string,
  folder = "spaceai/rooms",
): Promise<{ url: string; mocked: boolean }> {
  if (!cloudinaryConfigured) {
    return { url: dataUrl, mocked: true };
  }
  const res = await cloudinary.uploader.upload(dataUrl, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: res.secure_url, mocked: false };
}
