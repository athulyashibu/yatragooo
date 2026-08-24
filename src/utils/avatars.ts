export interface DefaultAvatar {
  id: string;
  name: string;
  url: string;
  category: 'Explorer' | 'Nomad' | 'Voyager' | 'Minimalist';
}

export const DEFAULT_AVATAR_COLLECTION: DefaultAvatar[] = [
  {
    id: 'avatar_01',
    name: 'Modern Nomad',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    category: 'Nomad',
  },
  {
    id: 'avatar_02',
    name: 'Marco Explorer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    category: 'Explorer',
  },
  {
    id: 'avatar_03',
    name: 'Sarah Adventurer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    category: 'Voyager',
  },
  {
    id: 'avatar_04',
    name: 'Global Trekker',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    category: 'Explorer',
  },
  {
    id: 'avatar_05',
    name: 'Backpacker Zen',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    category: 'Nomad',
  },
  {
    id: 'avatar_06',
    name: 'Aviation Voyager',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    category: 'Voyager',
  },
  {
    id: 'avatar_07',
    name: 'Peak Climber',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    category: 'Explorer',
  },
  {
    id: 'avatar_08',
    name: 'Island Wanderer',
    url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=250',
    category: 'Nomad',
  },
  {
    id: 'avatar_09',
    name: 'Sky Travel Enthusiast',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    category: 'Voyager',
  },
  {
    id: 'avatar_10',
    name: 'Alpine Pathfinder',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    category: 'Explorer',
  },
  {
    id: 'avatar_11',
    name: 'Executive Globe Trotter',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    category: 'Minimalist',
  },
  {
    id: 'avatar_12',
    name: 'Ocean Cruiser',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    category: 'Voyager',
  },
  {
    id: 'avatar_13',
    name: 'Urban Guide',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    category: 'Minimalist',
  },
  {
    id: 'avatar_14',
    name: 'Cultural Explorer',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250',
    category: 'Nomad',
  },
  {
    id: 'avatar_15',
    name: 'Trailblazer',
    url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250',
    category: 'Explorer',
  },
  {
    id: 'avatar_16',
    name: 'Digital Nomad Tech',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    category: 'Minimalist',
  },
  {
    id: 'avatar_17',
    name: 'Coastline Cruiser',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    category: 'Voyager',
  },
  {
    id: 'avatar_18',
    name: 'Summit Seeker',
    url: 'https://images.unsplash.com/photo-1542206075-35099d86125f?auto=format&fit=crop&q=80&w=250',
    category: 'Explorer',
  },
];

/**
 * Returns a random default avatar URL for new registrations
 */
export function getRandomDefaultAvatar(): string {
  const randomIndex = Math.floor(Math.random() * DEFAULT_AVATAR_COLLECTION.length);
  return DEFAULT_AVATAR_COLLECTION[randomIndex].url;
}

/**
 * Returns a deterministic default avatar based on a user ID or email string
 */
export function getDefaultAvatarForUser(identifier?: string): string {
  if (!identifier) return DEFAULT_AVATAR_COLLECTION[0].url;
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_AVATAR_COLLECTION.length;
  return DEFAULT_AVATAR_COLLECTION[index].url;
}

/**
 * Validates uploaded image file format (JPG, JPEG, PNG, WebP) and size (< 5MB)
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a JPG, JPEG, PNG, or WebP image.',
    };
  }

  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size too large (${sizeMb} MB). Maximum allowed upload size is 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Helper to process, crop, and convert an image file to an optimized Data URL
 */
export function processAndCompressImage(
  file: File,
  targetWidth = 400,
  targetHeight = 400
): Promise<string> {
  return new Promise((resolve, reject) => {
    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Corrupted or unsupported image file.'));
      img.onload = () => {
        // Create offscreen canvas for square cropping & compression
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Calculate center crop dimensions
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        // Draw center crop to canvas
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetWidth, targetHeight);

        // Convert to WebP or JPEG Data URL with 0.88 quality compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
