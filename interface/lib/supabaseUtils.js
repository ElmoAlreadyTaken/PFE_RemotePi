import { supabase } from './supabase';


export async function uploadFile(file, path) {
  const { data, error } = await supabase.storage
    .from('your-bucket-name') 
    .upload(path, file);

  if (error) {
    console.error('Erreur lors de l’upload:', error.message);
    throw error;
  }

  return data;
}
