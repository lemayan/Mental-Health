# Provider Photo Upload System

## Overview
This system handles provider profile photo uploads to Supabase Storage with automatic compression and validation.

## Features
- ✅ **Image Validation**: Checks file type, size (max 5MB), and format
- ✅ **Automatic Compression**: Resizes images to max 800x800px while maintaining aspect ratio
- ✅ **Quality Optimization**: Compresses to JPEG at 80% quality
- ✅ **Secure Storage**: Uploads to Supabase Storage bucket
- ✅ **Public URLs**: Generates public URLs for displaying photos
- ✅ **Error Handling**: Comprehensive error messages for users

## Setup Instructions

### 1. Run Database Migration
Apply the migration to create the storage bucket and policies:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Dashboard
# Go to SQL Editor and run: supabase/migrations/00002_provider_photos_storage.sql
```

### 2. Verify Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Verify `provider-photos` bucket exists
3. Confirm it's set to **Public**
4. Check that RLS policies are enabled

### 3. Environment Variables
Ensure these are set in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## How It Works

### Upload Flow
1. User selects an image file
2. **Validation**: Check file type, size, extension
3. **Preview**: Show thumbnail preview with checkmark
4. **Compression**: Resize and compress image on form submit
5. **Upload**: Send to Supabase Storage
6. **URL**: Get public URL and save to database
7. **Database**: Store URL in `providers.photo_url` column

### File Processing
```typescript
// Original: 3MB, 2400x1800px
// ↓ Compression
// Result: ~200KB, 800x600px (maintains aspect ratio)
```

## Usage

### In Provider Form
```tsx
import { uploadProviderPhoto, validateImageFile } from '@/lib/uploadPhoto';

// Validate file
const validation = validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Upload photo
const photoUrl = await uploadProviderPhoto(file, providerId);

// Save to database
await supabase
  .from('providers')
  .update({ photo_url: photoUrl })
  .eq('id', providerId);
```

### Update Existing Photo
```typescript
import { updateProviderPhoto } from '@/lib/uploadPhoto';

// Automatically deletes old photo and uploads new one
const newPhotoUrl = await updateProviderPhoto(
  oldPhotoUrl, 
  newFile, 
  providerId
);
```

### Delete Photo
```typescript
import { deleteProviderPhoto } from '@/lib/uploadPhoto';

await deleteProviderPhoto(photoUrl);
```

## API Reference

### `uploadProviderPhoto(file: File, providerId?: string): Promise<string>`
Uploads a provider photo and returns the public URL.

**Parameters:**
- `file`: Image file to upload
- `providerId`: Optional provider ID for filename

**Returns:** Public URL string

**Throws:** Error if validation fails or upload fails

### `validateImageFile(file: File): { valid: boolean; error?: string }`
Validates an image file before upload.

**Returns:** 
- `valid`: true if file is valid
- `error`: Error message if invalid

### `compressImage(file: File, maxWidth?: number, maxHeight?: number, quality?: number): Promise<Blob>`
Compresses and resizes an image.

**Defaults:**
- `maxWidth`: 800px
- `maxHeight`: 800px
- `quality`: 0.8 (80%)

### `deleteProviderPhoto(photoUrl: string): Promise<void>`
Deletes a photo from storage.

### `updateProviderPhoto(oldPhotoUrl: string | null, newFile: File, providerId?: string): Promise<string>`
Replaces an existing photo with a new one.

## Storage Structure

```
provider-photos/
  ├── 1733789123-abc123.jpg
  ├── 1733789456-def456.jpg
  └── [providerId]-xyz789.jpg
```

**Filename format:** `{providerId|timestamp}-{random}.{ext}`

## Security

### Storage Policies
- **Public Read**: Anyone can view photos (necessary for public profiles)
- **Authenticated Upload**: Only logged-in users can upload
- **Authenticated Update/Delete**: Only logged-in users can modify

### Validation
- ✅ File type check (must be image/*)
- ✅ Size limit (5MB max)
- ✅ Extension whitelist (jpg, jpeg, png, gif, webp)
- ✅ MIME type validation

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| "File must be an image" | Wrong file type | Upload JPG, PNG, GIF, or WebP |
| "Image must be less than 5MB" | File too large | Compress or resize before upload |
| "Failed to upload photo" | Storage error | Check bucket exists and is public |
| "Invalid photo URL" | Bad URL format | Ensure URL is from Supabase Storage |

## Testing

### Manual Test
1. Go to `/for-providers/create`
2. Click "Choose File" under Profile photo
3. Select an image (try different sizes/formats)
4. Verify preview shows with green checkmark
5. Fill form and submit
6. Check photo uploads and URL is saved

### Test Cases
- ✅ Upload valid image (JPG, PNG)
- ✅ Try oversized image (>5MB) - should show error
- ✅ Try non-image file - should show error
- ✅ Large image (4000x3000) - should compress to 800x600
- ✅ Submit without photo - should work (photo optional)

## Troubleshooting

### Photo not uploading
1. Check Supabase Storage bucket exists
2. Verify bucket is public
3. Check RLS policies are enabled
4. Verify environment variables

### Photo not displaying
1. Check `photo_url` is saved in database
2. Verify URL is accessible (try opening in browser)
3. Check CORS settings in Supabase

### Compression issues
1. Check browser console for errors
2. Verify canvas API is supported
3. Try different image formats

## Performance

- **Original image**: 3-5MB, 3000x2000px
- **Compressed**: ~200-300KB, 800x600px
- **Upload time**: 1-3 seconds (depends on connection)
- **Storage cost**: ~$0.021 per GB/month (Supabase pricing)

## Future Enhancements

- [ ] Image cropping UI
- [ ] Multiple photo upload
- [ ] Drag-and-drop interface
- [ ] WebP format conversion
- [ ] CDN integration
- [ ] Image optimization service
- [ ] Thumbnail generation
- [ ] Watermark option
