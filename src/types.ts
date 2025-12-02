// src/types.ts

export interface License {
  _id: string;
  type: string;
  title: string;
  description: string;
  features: string[];
  price: number; // Assuming you have a price field; if not, you can omit this
}
export interface Track {
  id: string;
  _id?: string; // Optional to handle backend data
  title: string;
  artist: string;
  bpm: number;
  key: string;
  dateAdded: string;
  duration: string;
  price: number;
  image: string;
  audioUrl: string;
  licenses: License[];
  s3_mp3_url: string;
  s3_image_url: string;
  tags: string[];
  available: boolean;
  type: string;
  youtube_url?: string | null;
}

export interface Pack {
  id: string;
  title: string;
  price: number;
  tags: string[];
  s3_image_url: string | null;
  s3_mp3_url: string;
  s3_free_url: string;
  created_at: string;
  available: boolean;
  type: string;
  licenses: License[];
}

export interface CustomerInfo {
  name: string;
  email: string;
  emailConfirm: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
