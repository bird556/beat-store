import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface BeatFormData {
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  key: string;
  tags: string[];
  available: boolean;
}
const AdminCreateBeat = () => {
  const navigate = useNavigate();
  const [
    isLoading,
    // setIsLoading
  ] = useState(false);
  const [formData, setFormData] = useState<BeatFormData>({
    title: '',
    artist: '',
    duration: '',
    bpm: 140,
    key: '',
    tags: [],
    available: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [taggedFile, setTaggedFile] = useState<File | null>(null);
  const [basicFile, setBasicFile] = useState<File | null>(null);
  const [premiumFile, setPremiumFile] = useState<File | null>(null);
  const [proFile, setProFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Generate key options
  const majorKeys = [
    'A',
    'A#',
    'B',
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
  ];
  const allKeys = [
    ...majorKeys.map((k) => `${k} Major`),
    ...majorKeys.map((k) => `${k} Minor`),
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'bpm' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }));
  };

  const handleKeyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, key: value }));
  };

  const handleAvailableToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, available: checked }));
  };

  const uploadFile = async (file: File, type: string, title: string) => {
    console.log(file, type, title);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('title', title);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      toast.error(`Failed to upload ${type}: ${(err as Error).message}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    toast
      .promise(
        (async () => {
          if (!formData.title) {
            throw new Error('Title is required for file uploads.');
          }
          if (
            !imageFile ||
            !taggedFile ||
            !basicFile ||
            !premiumFile ||
            !proFile
          ) {
            throw new Error('All files must be selected.');
          }

          const imageUrl = await uploadFile(imageFile, 'image', formData.title);
          if (!imageUrl) throw new Error('Image upload failed');

          const taggedUrl = await uploadFile(
            taggedFile,
            'tagged_mp3',
            formData.title
          );
          if (!taggedUrl) throw new Error('Tagged MP3 upload failed');

          const basicUrl = await uploadFile(
            basicFile,
            'basic_mp3',
            formData.title
          );
          if (!basicUrl) throw new Error('Basic MP3 upload failed');

          const premiumUrl = await uploadFile(
            premiumFile,
            'premium_zip',
            formData.title
          );
          if (!premiumUrl) throw new Error('Premium MP3 upload failed');

          const proUrl = await uploadFile(proFile, 'pro_zip', formData.title);
          if (!proUrl) throw new Error('Professional ZIP upload failed');

          const licenses = [
            {
              type: 'Basic',
              price: 39.99,
              currency: 'USD',
              description:
                'Basic License includes MP3 format, non-exclusive rights, distribution up to 2,500 copies, 1 music video, and producer tag removal.',
              s3_file_url: basicUrl,
              features: [
                'MP3 Format',
                'Non-Exclusive Rights',
                'Distribute up to 2,500 copies',
                'Up to 50,000 Online Audio Streams',
                '1 Music Video',
                'Basic Distribution Rights',
                'Producer Tag Removed',
              ],
            },
            {
              type: 'Premium',
              price: 59.99,
              currency: 'USD',
              description:
                'Premium License includes WAV + MP3 format, expanded distribution rights, live performances, and limited radio rights.',
              s3_file_url: premiumUrl,
              features: [
                'WAV + MP3 Format',
                'Non-Exclusive Rights',
                'Distribute up to 5,000 copies',
                'Up to 100,000 Online Audio Streams',
                '1 Music Video',
                'For Profit Live Performances',
                'Radio Broadcasting rights (2 Stations)',
                'Producer Tag Removed',
              ],
            },
            {
              type: 'Professional',
              price: 129.99,
              currency: 'USD',
              description:
                'Professional License includes stems, large-scale streaming capacity, live and radio rights, and distribution up to 10,000 units.',
              s3_file_url: proUrl,
              features: [
                'WAV + MP3 Format',
                'Trackout Stems Included',
                'Distribute up to 10,000 copies',
                'Up to 1,000,000 Online Audio Streams',
                '1 Music Video',
                'For Profit Live Performances',
                'Radio Broadcasting rights (2 Stations)',
                'Producer Tag Removed',
              ],
            },
            {
              type: 'Legacy',
              price: 199.99,
              currency: 'USD',
              description:
                'Legacy License offers unrestricted use across all platforms and unlimited media coverage.',
              s3_file_url: proUrl,
              features: [
                'WAV + MP3 Format',
                'Trackout Stems Included',
                'Distribute Unlimited copies',
                'Unlimited Online Audio Streams',
                'Unlimited Music Videos',
                'For Profit Live Performances',
                'Radio Broadcasting rights (UNLIMITED Stations)',
                'Producer Tag Removed',
              ],
            },
            {
              type: 'Exclusive',
              price: 1999.99,
              currency: 'USD',
              description:
                'Exclusive License grants complete ownership, full monetization, and contractual rights for global usage.',
              s3_file_url: proUrl,
              features: [
                'WAV + MP3 Format',
                'Trackout Stems Included',
                'Distribute Unlimited copies',
                'Unlimited Online Audio Streams',
                'Unlimited Music Videos',
                'For Profit Live Performances',
                'Radio Broadcasting rights (UNLIMITED Stations)',
                'Producer Tag Removed',
                'Full Commercial Rights',
                'Receive Signed Contract',
              ],
            },
          ];

          const submitData = {
            ...formData,
            s3_mp3_url: taggedUrl,
            s3_image_url: imageUrl,
            licenses,
            type: 'Beat',
          };

          console.log(
            'Submitting beat data:',
            JSON.stringify(submitData, null, 2)
          );
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/beat`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(submitData),
            }
          );

          if (!response.ok) {
            throw new Error(`Create failed: ${response.statusText}`);
          }

          return response.json();
        })(),
        {
          loading: `Uploading ${formData.title}...`,
          success: `Successfully uploaded ${formData.title}!`,
          error: (err) => err.message,
        }
      )
      .then(() => {
        setUploading(false);
        navigate('/admin/beats');
      })
      .catch(() => {
        setUploading(false);
      });
  };

  const handleImageDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      setImageFile(file);
      console.log('file', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaggedDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== 'audio/mpeg') {
        toast.error('Please select a valid MP3 file.');
        return;
      }
      setTaggedFile(file);
    }
  };

  const handleBasicDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== 'audio/mpeg') {
        toast.error('Please select a valid MP3 file.');
        return;
      }
      setBasicFile(file);
    }
  };

  const handlePremiumDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (
        file.type !== 'application/zip' &&
        file.type !== 'application/x-zip-compressed'
      ) {
        toast.error('Please select a valid ZIP file.');
        return;
      }
      setPremiumFile(file);
    }
  };

  const handleProDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (
        file.type !== 'application/zip' &&
        file.type !== 'application/x-zip-compressed'
      ) {
        toast.error('Please select a valid ZIP file.');
        return;
      }
      setProFile(file);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider
        className="!z-50 !relative"
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Create Beat" />
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      className="!z-50 !relative"
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Create Beat" />

        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Upload Beat</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center space-x-16 flex-col md:flex-row">
              <div className="md:max-w-1/4 space-y-4">
                <Label className="text-lg" htmlFor="image">
                  Artwork Image
                </Label>
                {/* <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                /> */}
                <Dropzone
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                  maxFiles={1}
                  maxSize={10 * 1024 * 1024} // 10MB
                  onDrop={handleImageDrop}
                  onError={(err) => toast.error(`Image error: ${err.message}`)}
                  src={imageFile ? [imageFile] : undefined} // Pass File object
                  className="!p-0"
                >
                  <DropzoneEmptyState />
                  <DropzoneContent className="flex justify-center items-center">
                    {imagePreview && (
                      <img
                        alt="Preview"
                        className="w-full h-full object-cover aspect-square"
                        src={imagePreview}
                      />
                    )}
                  </DropzoneContent>
                </Dropzone>
              </div>
              <div className="grow space-y-8 w-full">
                {/* Title */}
                <div className="space-y-2 !w-full">
                  <Label className="text-lg" htmlFor="title">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Artist */}
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="artist">
                    Artist
                  </Label>
                  <Input
                    id="artist"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 justify-center">
              {' '}
              {/* Tagged MP3 */}
              <div className="space-y-2">
                <Label htmlFor="tagged">Tagged MP3 (Preview)</Label>
                {/* <Input
                id="tagged"
                type="file"
                accept="audio/mp3"
                onChange={handleTaggedChange}
              /> */}
                <Dropzone
                  accept={{ 'audio/mpeg': ['.mp3'] }}
                  maxFiles={1}
                  maxSize={500 * 1024 * 1024} // 500MB
                  onDrop={handleTaggedDrop}
                  onError={(err) =>
                    toast.error(`Tagged MP3 error: ${err.message}`)
                  }
                  src={taggedFile ? [taggedFile] : undefined}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent>
                    {taggedFile && (
                      <p className="text-sm text-gray-500">{taggedFile.name}</p>
                    )}
                  </DropzoneContent>
                </Dropzone>
              </div>
              {/* Basic MP3 */}
              <div className="space-y-2">
                <Label htmlFor="basic">Basic Lease MP3</Label>
                {/* <Input
                id="basic"
                type="file"
                accept="audio/mp3"
                onChange={handleBasicChange}
              /> */}
                <Dropzone
                  accept={{ 'audio/mpeg': ['.mp3'] }}
                  maxFiles={1}
                  maxSize={500 * 1024 * 1024} // 500MB
                  onDrop={handleBasicDrop}
                  onError={(err) =>
                    toast.error(`Basic MP3 error: ${err.message}`)
                  }
                  src={basicFile ? [basicFile] : undefined}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent>
                    {basicFile && (
                      <p className="text-sm text-gray-500">{basicFile.name}</p>
                    )}
                  </DropzoneContent>
                </Dropzone>
              </div>
              {/* Premium MP3 */}
              <div className="space-y-2">
                <Label htmlFor="premium">Premium Lease MP3 + WAV</Label>
                {/* <Input
                id="premium"
                type="file"
                accept="application/zip"
                onChange={handlePremiumChange}
              /> */}
                <Dropzone
                  accept={{
                    'application/zip': ['.zip'],
                    'application/x-zip-compressed': ['.zip'],
                  }}
                  maxFiles={1}
                  maxSize={500 * 1024 * 1024} // 500MB
                  onDrop={handlePremiumDrop}
                  onError={(err) =>
                    toast.error(`Premium ZIP error: ${err.message}`)
                  }
                  src={premiumFile ? [premiumFile] : undefined}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent>
                    {premiumFile && (
                      <p className="text-sm text-gray-500">
                        {premiumFile.name}
                      </p>
                    )}
                  </DropzoneContent>
                </Dropzone>
              </div>
              {/* STEMS ZIP */}
              <div className="space-y-2">
                <Label htmlFor="pro">
                  STEMS ZIP (For Professional, Legacy & Exclusive)
                </Label>
                {/* <Input
                id="pro"
                type="file"
                accept="application/zip"
                onChange={handleProChange}
              /> */}
                <Dropzone
                  accept={{
                    'application/zip': ['.zip'],
                    'application/x-zip-compressed': ['.zip'],
                  }}
                  maxFiles={1}
                  maxSize={500 * 1024 * 1024} // 500MB
                  onDrop={handleProDrop}
                  onError={(err) =>
                    toast.error(`Professional ZIP error: ${err.message}`)
                  }
                  src={proFile ? [proFile] : undefined}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent>
                    {proFile && (
                      <p className="text-sm text-gray-500">{proFile.name}</p>
                    )}
                  </DropzoneContent>
                </Dropzone>
              </div>
            </div>

            {/* BPM */}
            <div className="space-y-2">
              <Label className="text-base" htmlFor="bpm">
                BPM
              </Label>
              <Input
                id="bpm"
                name="bpm"
                type="number"
                value={formData.bpm}
                onChange={handleInputChange}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-base" htmlFor="duration">
                Duration (e.g., 3:45)
              </Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>

            {/* Key */}
            <div className="space-y-2">
              <Label className="text-base" htmlFor="key">
                Key
              </Label>
              <Select
                onValueChange={handleKeyChange}
                defaultValue={formData.key}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select key" />
                </SelectTrigger>
                <SelectContent>
                  {allKeys.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-base" htmlFor="tags">
                Tags (comma-separated)
              </Label>
              <Input id="tags" value={tagsInput} onChange={handleTagsChange} />
            </div>

            {/* Available */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={formData.available}
                onCheckedChange={handleAvailableToggle}
              />
              <Label htmlFor="available">Available</Label>
            </div>

            <Button type="submit" disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
              Upload Beat
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminCreateBeat;
