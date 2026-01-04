/**
 * Supabase Storage Service
 * Handles image upload, retrieval, and deletion for the asset library
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { logger } from '../utils';

const BUCKET_NAME = 'assets';
const IMAGES_FOLDER = 'images';
const PRODUCT_IMAGERY_FOLDER = 'product-imagery';
const DOCS_FOLDER = 'docs';

/**
 * Upload an image to Supabase Storage
 * @param {File|Blob} file - The image file to upload
 * @param {string} fileName - The name to save the file as
 * @param {string} userId - The user's ID (for organizing files)
 * @returns {Promise<{url: string, path: string, error: Error|null}>}
 */
export const uploadImage = async (file, fileName, userId = 'default') => {
  if (!isSupabaseConfigured()) {
    logger.warn('Supabase not configured - using local storage only');
    return { url: null, path: null, error: new Error('Supabase not configured') };
  }

  try {
    // Create a unique file path
    const fileExt = fileName.split('.').pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${IMAGES_FOLDER}/${uniqueName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/webp',
    });

    if (error) {
      logger.error('Upload error:', error);
      return { url: null, path: null, error };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (error) {
    logger.error('Upload failed:', error);
    return { url: null, path: null, error };
  }
};

/**
 * List all images for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<{files: Array, error: Error|null}>}
 */
export const listImages = async (userId = 'default') => {
  if (!isSupabaseConfigured()) {
    return { files: [], error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(`${userId}/${IMAGES_FOLDER}`, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      logger.error('List error:', error);
      return { files: [], error };
    }

    // Filter out folders and get public URLs
    const files = (data || [])
      .filter((file) => file.name && !file.name.endsWith('/'))
      .map((file) => {
        const path = `${userId}/${IMAGES_FOLDER}/${file.name}`;
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

        return {
          id: file.id || file.name,
          name: file.name,
          path,
          url: urlData.publicUrl,
          size: file.metadata?.size || 0,
          createdAt: file.created_at,
        };
      });

    return { files, error: null };
  } catch (error) {
    logger.error('List failed:', error);
    return { files: [], error };
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} path - The full path of the file to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteImage = async (path) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      logger.error('Delete error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    logger.error('Delete failed:', error);
    return { success: false, error };
  }
};

/**
 * Upload multiple images with progress callback
 * @param {Array<{file: File, fileName: string}>} files - Array of files to upload
 * @param {string} userId - The user's ID
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<Array<{url: string, path: string, error: Error|null}>>}
 */
export const uploadImages = async (files, userId = 'default', onProgress = null) => {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const { file, fileName } = files[i];

    if (onProgress) {
      onProgress(i, files.length);
    }

    const result = await uploadImage(file, fileName, userId);
    results.push({
      ...result,
      originalName: fileName,
    });
  }

  if (onProgress) {
    onProgress(files.length, files.length);
  }

  return results;
};

// ============================================
// PRODUCT IMAGERY FUNCTIONS
// ============================================

/**
 * Upload a product image to Supabase Storage
 * @param {File|Blob} file - The image file to upload
 * @param {string} fileName - The name to save the file as
 * @param {string} userId - The user's ID
 * @returns {Promise<{url: string, path: string, error: Error|null}>}
 */
export const uploadProductImage = async (file, fileName, userId = 'default') => {
  if (!isSupabaseConfigured()) {
    logger.warn('Supabase not configured - using local storage only');
    return { url: null, path: null, error: new Error('Supabase not configured') };
  }

  try {
    const fileExt = fileName.split('.').pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${PRODUCT_IMAGERY_FOLDER}/${uniqueName}`;

    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/png',
    });

    if (error) {
      logger.error('Product image upload error:', error);
      return { url: null, path: null, error };
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (error) {
    logger.error('Product image upload failed:', error);
    return { url: null, path: null, error };
  }
};

/**
 * List all product images for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<{files: Array, error: Error|null}>}
 */
export const listProductImages = async (userId = 'default') => {
  if (!isSupabaseConfigured()) {
    return { files: [], error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(`${userId}/${PRODUCT_IMAGERY_FOLDER}`, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      logger.error('List product images error:', error);
      return { files: [], error };
    }

    const files = (data || [])
      .filter((file) => file.name && !file.name.endsWith('/'))
      .map((file) => {
        const path = `${userId}/${PRODUCT_IMAGERY_FOLDER}/${file.name}`;
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

        return {
          id: file.id || file.name,
          name: file.name,
          path,
          url: urlData.publicUrl,
          size: file.metadata?.size || 0,
          createdAt: file.created_at,
        };
      });

    return { files, error: null };
  } catch (error) {
    logger.error('List product images failed:', error);
    return { files: [], error };
  }
};

/**
 * Delete a product image from Supabase Storage
 * @param {string} path - The full path of the file to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteProductImage = async (path) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      logger.error('Delete product image error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    logger.error('Delete product image failed:', error);
    return { success: false, error };
  }
};

// ============================================
// DOCS FUNCTIONS
// ============================================

/**
 * Upload a document to Supabase Storage
 * @param {File|Blob} file - The document file to upload
 * @param {string} fileName - The name to save the file as
 * @param {string} userId - The user's ID
 * @returns {Promise<{url: string, path: string, error: Error|null}>}
 */
export const uploadDoc = async (file, fileName, userId = 'default') => {
  if (!isSupabaseConfigured()) {
    logger.warn('Supabase not configured - using local storage only');
    return { url: null, path: null, error: new Error('Supabase not configured') };
  }

  try {
    const fileExt = fileName.split('.').pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${DOCS_FOLDER}/${uniqueName}`;

    // Determine content type based on extension
    const contentTypes = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      txt: 'text/plain',
      md: 'text/markdown',
    };
    const contentType = contentTypes[fileExt.toLowerCase()] || 'application/octet-stream';

    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType,
    });

    if (error) {
      logger.error('Doc upload error:', error);
      return { url: null, path: null, error };
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      originalName: fileName,
      error: null,
    };
  } catch (error) {
    logger.error('Doc upload failed:', error);
    return { url: null, path: null, error };
  }
};

/**
 * List all documents for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<{files: Array, error: Error|null}>}
 */
export const listDocs = async (userId = 'default') => {
  if (!isSupabaseConfigured()) {
    return { files: [], error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(`${userId}/${DOCS_FOLDER}`, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      logger.error('List docs error:', error);
      return { files: [], error };
    }

    const files = (data || [])
      .filter((file) => file.name && !file.name.endsWith('/'))
      .map((file) => {
        const path = `${userId}/${DOCS_FOLDER}/${file.name}`;
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

        return {
          id: file.id || file.name,
          name: file.name,
          path,
          url: urlData.publicUrl,
          size: file.metadata?.size || 0,
          createdAt: file.created_at,
        };
      });

    return { files, error: null };
  } catch (error) {
    logger.error('List docs failed:', error);
    return { files: [], error };
  }
};

/**
 * Delete a document from Supabase Storage
 * @param {string} path - The full path of the file to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteDoc = async (path) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      logger.error('Delete doc error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    logger.error('Delete doc failed:', error);
    return { success: false, error };
  }
};

export default {
  // Images
  uploadImage,
  uploadImages,
  listImages,
  deleteImage,
  // Product Imagery
  uploadProductImage,
  listProductImages,
  deleteProductImage,
  // Docs
  uploadDoc,
  listDocs,
  deleteDoc,
  // Constants
  BUCKET_NAME,
};
