import { createClient } from '@/lib/supabase/client';

/**
 * Compress and resize image before upload
 */
export async function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Upload a photo to Supabase Storage
 * Returns the public URL of the uploaded photo
 */
export async function uploadProviderPhoto(file: File, providerId?: string): Promise<string> {
  const supabase = createClient();

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('Image must be less than 5MB');
  }

  try {
    // Compress the image
    const compressedBlob = await compressImage(file);

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${providerId || Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `provider-photos/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('provider-photos')
      .upload(filePath, compressedBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload photo: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('provider-photos')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get photo URL');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Photo upload error:', error);
    throw error;
  }
}

/**
 * Delete a photo from Supabase Storage
 */
export async function deleteProviderPhoto(photoUrl: string): Promise<void> {
  const supabase = createClient();

  try {
    // Extract file path from URL
    const url = new URL(photoUrl);
    const pathMatch = url.pathname.match(/provider-photos\/.+/);
    
    if (!pathMatch) {
      throw new Error('Invalid photo URL');
    }

    const filePath = pathMatch[0];

    const { error } = await supabase.storage
      .from('provider-photos')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  } catch (error) {
    console.error('Photo deletion error:', error);
    throw error;
  }
}

/**
 * Update provider photo (delete old, upload new)
 */
export async function updateProviderPhoto(
  oldPhotoUrl: string | null,
  newFile: File,
  providerId?: string
): Promise<string> {
  // Delete old photo if exists
  if (oldPhotoUrl) {
    try {
      await deleteProviderPhoto(oldPhotoUrl);
    } catch (error) {
      console.error('Failed to delete old photo:', error);
      // Continue with upload even if deletion fails
    }
  }

  // Upload new photo
  return uploadProviderPhoto(newFile, providerId);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }

  // Check file extension
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !validExtensions.includes(fileExt)) {
    return { valid: false, error: 'Invalid file type. Use JPG, PNG, GIF, or WebP' };
  }

  return { valid: true };
}
