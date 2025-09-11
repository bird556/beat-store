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

interface BeatFormData {
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  key: string;
  tags: string[];
  s3_mp3_url?: string; // Make optional
  s3_image_url?: string; // Make optional
  available: boolean;
}

const AdminSingleBeat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const beatId = new URLSearchParams(location.search).get('beatId'); // Matching navigation param 'id'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BeatFormData>({
    title: '',
    artist: '',
    duration: '',
    bpm: 0,
    key: '',
    tags: [],
    s3_mp3_url: '',
    s3_image_url: '',
    available: true,
  });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
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
          `${import.meta.env.VITE_API_BASE_URL_BACKEND}/beat?beatId=${beatId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (response.status !== 200) {
          if (response.status === 404) {
            throw new Error(
              'Beat not found. It might have been removed or the link is incorrect.'
            );
          }
          throw new Error(
            `Failed to fetch beat data: Status ${response.status}`
          );
        }
        const data = await response.json();
        setFormData({
          title: data.title,
          artist: data.artist,
          duration: data.duration,
          bpm: data.bpm,
          key: data.key,
          tags: data.tags || [],
          s3_mp3_url: data.s3_mp3_url,
          s3_image_url: data.s3_image_url,
          available: data.available,
        });
        setTagsInput(data.tags.join(', '));
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };
    fetchBeat();
  }, [beatId]);

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

  const uploadFile = async (file: File, type: 'image' | 'audio') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Assuming a backend endpoint /upload that handles S3 upload and returns { url: string }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setUploading(false);
      return data.url;
    } catch (err) {
      setError((err as Error).message);
      setUploading(false);
      return null;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      const url = await uploadFile(file, 'image');
      if (url) {
        setFormData((prev) => ({ ...prev, s3_image_url: url }));
      }
    }
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAudioFile(file);
      const url = await uploadFile(file, 'audio');
      if (url) {
        setFormData((prev) => ({ ...prev, s3_mp3_url: url }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const submitData = {
      ...formData,
      ...(newImageFile && { s3_image_url: formData.s3_image_url }), // Only include if updated
      ...(newAudioFile && { s3_mp3_url: formData.s3_mp3_url }), // Only include if updated
    };

    toast
      .promise(
        (async () => {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL_BACKEND
            }/beat?beatId=${beatId}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(submitData),
            }
          );
          if (!response.ok) {
            throw new Error(`Update failed: ${response.statusText}`);
          }
          return response.json(); // Return the response to resolve the promise
        })(),
        {
          loading: 'Updating beat...',
          success: 'Beat updated successfully!',
          error: 'Failed to update beat.',
        }
      )
      .then(() => {
        setUploading(false);
        setNewImageFile(null);
        setNewAudioFile(null);
        navigate('/admin/beats');
      })
      .catch((err) => {
        setError(err.message);
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
            {/* Artwork Image */}

            {/* Audio File */}
            <div>
              <Label htmlFor="audio">Audio File (MP3)</Label>
              <audio controls src={formData.s3_mp3_url} className="mb-2" />
              <Input
                id="audio"
                type="file"
                accept="audio/mp3"
                onChange={handleAudioChange}
              />
            </div>

            <div className="flex items-center justify-center space-x-16">
              <div className="max-w-1/4">
                <div className="space-y-4">
                  <Label className="text-lg" htmlFor="image">
                    Artwork Image
                  </Label>
                  <img
                    src={formData.s3_image_url}
                    alt="Artwork"
                    className="aspect-square w-64 object-cover rounded-md overflow-hidden mb-2"
                  />
                </div>

                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="grow space-y-8">
                {/* Title */}
                <div className="space-y-2">
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
