import type { Role } from "./constants";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string;
  role: Role;
  discipline: string;
  created_at: string;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  discipline: string;
  author_id: string;
  author_name: string;
  created_at: string;
};

export type LectureNote = {
  id: string;
  title: string;
  subject: string;
  discipline: string;
  file_path: string;
  file_name: string;
  uploader_id: string;
  uploader_name: string;
  created_at: string;
};

export type AlumniProfile = {
  id: string;
  user_id: string | null;
  full_name: string;
  batch: string;
  discipline: string | null;
  job_title: string | null;
  organization: string | null;
  city: string | null;
  bio: string | null;
  linkedin: string | null;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image_path: string;
  created_at: string;
};
