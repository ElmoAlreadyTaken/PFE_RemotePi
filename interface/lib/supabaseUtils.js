// lib/supabaseUtils.js

import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage.
 *
 * @param {File} file - The file to be uploaded.
 * @param {string} path - The path where the file will be stored.
 * @returns The data or error from the upload operation.
 */
export async function uploadFile(file, path) {
  const { data, error } = await supabase.storage
    .from('your-bucket-name') // Replace with your actual bucket name
    .upload(path, file);

  if (error) {
    console.error('Erreur lors de l’upload:', error.message);
    throw error;
  }

  return data;
}
