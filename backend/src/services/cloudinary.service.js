import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a data URL or Base64 string to Cloudinary
 * @param {string} fileContent - The data URL or path to file
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<Object>} - The upload result containing the URL and public ID
 */
export const uploadImage = async (fileContent, folder = 'ai-website-builder') => {
  if (!fileContent) return null;

  try {
    const result = await cloudinary.uploader.upload(fileContent, {
      folder: folder,
      resource_type: 'auto', // Automatically detect image/video
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('[Cloudinary Service] Upload failed:', error.message);
    throw new Error('Image upload failed');
  }
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<Object>}
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('[Cloudinary Service] Delete failed:', error.message);
    return null;
  }
};
