import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
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
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react'; // Assuming you have lucide icons
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone';

interface License {
  type: string;
  price: number;
  currency: string;
  description: string;
  s3_file_url?: string;
  features: string[];
}

interface BeatFormData {
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  key: string;
  tags: string[];
  s3_mp3_url?: string;
  s3_image_url?: string;
  licenses: License[];
  available: boolean;
  youtube_url?: string | null;
}

const AdminSingleBeat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const beatId = new URLSearchParams(location.search).get('beatId');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [youtubeLinkError, setYoutubeLinkError] = useState<string | null>(null); // 👈 New state
  const [formData, setFormData] = useState<BeatFormData>({
    title: '',
    artist: '',
    duration: '',
    bpm: 0,
    key: '',
    tags: [],
    s3_mp3_url: '',
    s3_image_url: '',
    licenses: [],
    available: true,
    youtube_url: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [taggedFile, setTaggedFile] = useState<File | null>(null);
  const [basicFile, setBasicFile] = useState<File | null>(null);
  const [premiumFile, setPremiumFile] = useState<File | null>(null);
  const [proFile, setProFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [taggedPreview, setTaggedPreview] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchBeat = async () => {
      if (!beatId) {
        setError('Beat ID not provided in URL.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL_BACKEND
          }/api/beat?beatId=${beatId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (response.status !== 200) {
          if (response.status === 404) {
            throw new Error('Beat not found.');
          }
          throw new Error(
            `Failed to fetch beat data: Status ${response.status}`
          );
        }
        // const data = await response.json();
        const { beat, beatTagged, imagePreview } = await response.json();
        setFormData({
          title: beat.title,
          artist: beat.artist,
          duration: beat.duration,
          bpm: beat.bpm,
          key: beat.key,
          tags: beat.tags || [],
          s3_mp3_url: beat.s3_mp3_url,
          s3_image_url: beat.s3_image_url,
          licenses: beat.licenses || [],
          available: beat.available,
          youtube_url: beat.youtube_url || null,
        });
        setTagsInput(beat.tags.join(', '));
        setImagePreview(imagePreview); // Use presigned URL if needed
        setTaggedPreview(beatTagged); // Use presigned URL if needed
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };
    fetchBeat();
  }, [beatId]);

  // Add this helper function within the AdminSingleBeat component or outside of it
  const getYouTubeVideoId = (url: string | null | undefined): string | null => {
    if (!url) return null;

    // Regex to match various YouTube URL formats
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

    const match = url.match(regex);

    // Check if a match was found and it's the 11-character video ID
    return match && match[1].length === 11 ? match[1] : null;
  };
  const handleYouTubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    // 1. Update the form data immediately
    setFormData((prev) => ({
      ...prev,
      youtube_url: value || null, // Store the raw URL for display
    }));

    // 2. Perform validation if the input is not empty
    if (value) {
      const videoId = getYouTubeVideoId(value);

      if (videoId) {
        setYoutubeLinkError(null); // Clear error if valid
      } else {
        setYoutubeLinkError(
          'Invalid YouTube URL. Please use a standard YouTube link format.'
        ); // Set error if invalid
      }
    } else {
      setYoutubeLinkError(null); // Clear error if field is empty
    }
  };

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
    console.log('Uploading file:', { name: file.name, type, title });
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Upload failed for ${type}: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Upload successful:', { type, url: data.url });
      return data.url;
    } catch (err) {
      console.error('Upload error:', { type, error: err });
      toast.error(`Failed to upload ${type}: ${(err as Error).message}`);
      return null;
    }
  };

  const handleImageDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      setImageFile(file);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setTaggedPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
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
        !['application/zip', 'application/x-zip-compressed'].includes(file.type)
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
        !['application/zip', 'application/x-zip-compressed'].includes(file.type)
      ) {
        toast.error('Please select a valid ZIP file.');
        return;
      }
      setProFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check for the new YouTube link error
    if (youtubeLinkError) {
      toast.error('Cannot update beat: Please fix the invalid YouTube link.');
      return; // 👈 STOP submission if link is invalid
    }

    setUploading(true);

    toast
      .promise(
        (async () => {
          if (!formData.title.trim()) {
            throw new Error('Title is required and cannot be empty.');
          }

          const submitData: BeatFormData = {
            ...formData,
            licenses: formData.licenses,
          };

          // Upload new files if provided
          if (imageFile) {
            console.log('Uploading image...');
            const imageUrl = await uploadFile(
              imageFile,
              'image',
              formData.title
            );
            if (!imageUrl) throw new Error('Image upload failed');
            submitData.s3_image_url = imageUrl;
          }

          if (taggedFile) {
            console.log('Uploading tagged MP3...');
            const taggedUrl = await uploadFile(
              taggedFile,
              'tagged_mp3',
              formData.title
            );
            if (!taggedUrl) throw new Error('Tagged MP3 upload failed');
            submitData.s3_mp3_url = taggedUrl;
          }

          if (basicFile) {
            console.log('Uploading basic MP3...');
            const basicUrl = await uploadFile(
              basicFile,
              'basic_mp3',
              formData.title
            );
            if (!basicUrl) throw new Error('Basic MP3 upload failed');
            submitData.licenses = submitData.licenses.map((license) =>
              license.type === 'Basic'
                ? { ...license, s3_file_url: basicUrl }
                : license
            );
          }

          if (premiumFile) {
            console.log('Uploading premium ZIP...');
            const premiumUrl = await uploadFile(
              premiumFile,
              'premium_zip',
              formData.title
            );
            if (!premiumUrl) throw new Error('Premium ZIP upload failed');
            submitData.licenses = submitData.licenses.map((license) =>
              license.type === 'Premium'
                ? { ...license, s3_file_url: premiumUrl }
                : license
            );
          }

          if (proFile) {
            console.log('Uploading pro ZIP...');
            const proUrl = await uploadFile(proFile, 'pro_zip', formData.title);
            if (!proUrl) throw new Error('Professional ZIP upload failed');
            submitData.licenses = submitData.licenses.map((license) =>
              ['Professional', 'Legacy', 'Exclusive'].includes(license.type)
                ? { ...license, s3_file_url: proUrl }
                : license
            );
          }

          console.log(
            'Submitting beat data:',
            JSON.stringify(submitData, null, 2)
          );
          const response = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL_BACKEND
            }/api/beat?beatId=${beatId}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(submitData),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              `Update failed: ${errorData.error || response.statusText}`
            );
          }

          return response.json();
        })(),
        {
          loading: 'Updating beat...',
          success: 'Beat updated successfully!',
          error: (err) => err.message,
        }
      )
      .then(() => {
        setUploading(false);
        setImageFile(null);
        setTaggedFile(null);
        setBasicFile(null);
        setPremiumFile(null);
        setProFile(null);
        navigate('/admin/beats');
      })
      .catch(() => {
        setUploading(false);
      });
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
          <SiteHeader title="Edit Beat" />
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
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
          <SiteHeader title="Edit Beat" />
          <div className="text-red-500 p-4 font-extrabold">{error}</div>
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
        <SiteHeader title="Edit Beat" />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Edit Beat</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center space-x-16 flex-col md:flex-row">
              <div className="md:max-w-1/4 space-y-4">
                <Label className="text-lg" htmlFor="image">
                  Artwork Image
                </Label>
                <Dropzone
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                  maxFiles={1}
                  maxSize={10 * 1024 * 1024} // 10MB
                  onDrop={handleImageDrop}
                  onError={(err) => toast.error(`Image error: ${err.message}`)}
                  // @ts-ignore
                  src={imageFile ? [imageFile] : [formData.s3_image_url]}
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

            <div className="space-y-2">
              <Label className="text-lg" htmlFor="tagged">
                Tagged MP3
              </Label>
              {taggedPreview && (
                <audio controls src={taggedPreview} className="mb-2 w-full" />
              )}
              <Dropzone
                accept={{ 'audio/mpeg': ['.mp3'] }}
                maxFiles={1}
                maxSize={500 * 1024 * 1024} // 500MB
                onDrop={handleTaggedDrop}
                onError={(err) =>
                  toast.error(`Tagged MP3 error: ${err.message}`)
                }
                src={taggedFile ? [taggedFile] : undefined}
                className="!p-0"
              >
                <DropzoneEmptyState />
              </Dropzone>
            </div>

            <div className="space-y-2">
              <Label className="text-lg" htmlFor="basic">
                Basic MP3
              </Label>
              <Dropzone
                accept={{ 'audio/mpeg': ['.mp3'] }}
                maxFiles={1}
                maxSize={500 * 1024 * 1024} // 500MB
                onDrop={handleBasicDrop}
                onError={(err) =>
                  toast.error(`Basic MP3 error: ${err.message}`)
                }
                src={basicFile ? [basicFile] : undefined}
                className="!p-0"
              >
                <DropzoneEmptyState />
              </Dropzone>
            </div>

            <div className="space-y-2">
              <Label className="text-lg" htmlFor="premium">
                Premium ZIP
              </Label>
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
                className="!p-0"
              >
                <DropzoneEmptyState />
              </Dropzone>
            </div>

            <div className="space-y-2">
              <Label className="text-lg" htmlFor="pro">
                Professional ZIP
              </Label>
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
                className="!p-0"
              >
                <DropzoneEmptyState />
              </Dropzone>
            </div>

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

            <div className="space-y-2">
              <Label className="text-base" htmlFor="tags">
                Tags (comma-separated)
              </Label>
              <Input id="tags" value={tagsInput} onChange={handleTagsChange} />
            </div>

            <div className="space-y-2">
              <Label className="text-base" htmlFor="youtube_url">
                YouTube Link
              </Label>
              <Input
                id="youtube_url"
                name="youtube_url"
                value={formData.youtube_url || ''}
                onChange={handleYouTubeLinkChange} // 👈 Use dedicated handler
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                // Optional: Add a visual error state if your Input component supports it (e.g., 'aria-invalid')
                className={youtubeLinkError ? 'border-red-500' : ''}
              />
              {youtubeLinkError && ( // 👈 Display the error message
                <p className="text-sm text-red-500">{youtubeLinkError}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={handleAvailableToggle}
              />
              <Label htmlFor="available">Available</Label>
            </div>

            <Button type="submit" disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
              Update Beat
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminSingleBeat;
