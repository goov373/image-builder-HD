/**
 * Supabase Storage Service
 * Handles image upload, retrieval, and deletion for the asset library
 */

import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'assets';
const IMAGES_FOLDER = 'images';

/**
 * Upload an image to Supabase Storage
 * @param {File|Blob} file - The image file to upload
 * @param {string} fileName - The name to save the file as
 * @param {string} userId - The user's ID (for organizing files)
 * @returns {Promise<{url: string, path: string, error: Error|null}>}
 */
export const uploadImage = async (file, fileName, userId = 'default') => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using local storage only');
    return { url: null, path: null, error: new Error('Supabase not configured') };
  }

  try {
    // Create a unique file path
    const fileExt = fileName.split('.').pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${IMAGES_FOLDER}/${uniqueName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/webp',
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, path: null, error };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (error) {
    console.error('Upload failed:', error);
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
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`${userId}/${IMAGES_FOLDER}`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('List error:', error);
      return { files: [], error };
    }

    // Filter out folders and get public URLs
    const files = (data || [])
      .filter(file => file.name && !file.name.endsWith('/'))
      .map(file => {
        const path = `${userId}/${IMAGES_FOLDER}/${file.name}`;
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(path);

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
    console.error('List failed:', error);
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
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete failed:', error);
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

export default {
  uploadImage,
  uploadImages,
  listImages,
  deleteImage,
  BUCKET_NAME,
};

