import { colorMapKeys } from "@/helpers/sortGenreColors";

export interface Book_highlight {
  _id: string;
  deleted: boolean;
  Text: string;
  Page?: number;
  LocationStart?: number;
  LocationEnd?: number;
  LocationStartX?: number;
  LocationEndX?: number;
  Date: string;
  notes: string;
  starred: boolean;
  category: string[];
  last_updated: string;
}

export interface Meta_con_highlight {
  author: string;
  highlight: Book_highlight;
  title: string;
  book_id: string;
}

export interface Book {
  length: number;
  userID: string;
  cover_image: string;
  isbn: string;
  author: string;
  title: string;
  genre: string[];
  rating: number;
  summary: string;
  deleted: boolean;
  upload_date: string;
  highlights: Book_highlight[];
  _id: string;
}

export interface users {
  username: string;
  userID: string;
}

export interface userInfo {
  password: string;
  registration_date: Date;
  username: string;
  profile_picture: string;
  book_count: number;
  dark_mode: boolean;
  column_count: number;
  genres: { [key: string]: colorMapKeys };
  categories: string[];
  last_upload: string;
  notion_auth: string;
  verified_email: boolean;
  subscription: boolean;
  stripe_customer_id: string;
  has_trial_period: boolean;
  subscription_end: Date;
}
