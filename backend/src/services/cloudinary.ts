import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadBuffer(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload fallido'));
        resolve(result.secure_url);
      },
    ).end(buffer);
  });
}

export async function listImages(folder = 'marcelasbakery/products', maxResults = 500): Promise<{ url: string; publicId: string; filename: string }[]> {
  const toItem = (r: any) => ({
    url: r.secure_url as string,
    publicId: r.public_id as string,
    filename: (r.public_id as string).split('/').pop() ?? r.public_id,
  });

  const seen = new Set<string>();
  const merged: ReturnType<typeof toItem>[] = [];

  const add = (resources: any[]) => {
    for (const r of resources) {
      if (!seen.has(r.public_id)) {
        seen.add(r.public_id);
        merged.push(toItem(r));
      }
    }
  };

  // Method 1: Dynamic Folder mode — images uploaded via Cloudinary UI
  try {
    const dynResult = await (cloudinary.api as any).resources_by_asset_folder(folder, {
      max_results: maxResults,
      resource_type: 'image',
    });
    if (dynResult?.resources?.length) add(dynResult.resources);
  } catch { /* account may not support dynamic folders */ }

  // Method 2: Fixed Folder mode — images uploaded via API (public_id starts with folder/)
  try {
    const fixResult = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: folder,
      max_results: maxResults,
    });
    if (fixResult?.resources?.length) add(fixResult.resources);
  } catch { /* ignore */ }

  return merged.sort(
    (a, b) => 0, // preserve discovery order (newest first from dynamic, then fixed)
  );
}
