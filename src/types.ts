// src/types.ts
export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  dateAdded: string;
  duration: string;
  price: number;
  image: string;
  audioUrl: string;
  licenses: object[];
  s3_mp3_url: string;
  s3_image_url: string;
}
