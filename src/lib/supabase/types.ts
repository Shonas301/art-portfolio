// database schema types for supabase
// these types reflect the art portfolio database structure

// enum types for various fields
export type MediaType = 'image' | 'video' | 'model_3d' | 'gif';
export type InquiryType = 'general' | 'commission' | 'purchase' | 'collaboration';
export type InquiryStatus = 'new' | 'read' | 'responded' | 'archived';

// section table - defines portfolio sections and their physical page positions
export interface Section {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  physical_page_start: number;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionInsert {
  id?: string;
  slug: string;
  title: string;
  description?: string | null;
  physical_page_start: number;
  display_order: number;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SectionUpdate {
  id?: string;
  slug?: string;
  title?: string;
  description?: string | null;
  physical_page_start?: number;
  display_order?: number;
  is_visible?: boolean;
  updated_at?: string;
}

// artwork table - individual art pieces with media and metadata
export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  media_type: MediaType;
  cloudinary_public_id: string | null;
  cloudinary_url: string | null;
  thumbnail_url: string | null;
  external_url: string | null;
  materials: string | null;
  dimensions: string | null;
  year_created: number | null;
  is_for_sale: boolean;
  shop_url: string | null;
  price_range: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArtworkInsert {
  id?: string;
  title: string;
  description?: string | null;
  long_description?: string | null;
  media_type: MediaType;
  cloudinary_public_id?: string | null;
  cloudinary_url?: string | null;
  thumbnail_url?: string | null;
  external_url?: string | null;
  materials?: string | null;
  dimensions?: string | null;
  year_created?: number | null;
  is_for_sale?: boolean;
  shop_url?: string | null;
  price_range?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ArtworkUpdate {
  id?: string;
  title?: string;
  description?: string | null;
  long_description?: string | null;
  media_type?: MediaType;
  cloudinary_public_id?: string | null;
  cloudinary_url?: string | null;
  thumbnail_url?: string | null;
  external_url?: string | null;
  materials?: string | null;
  dimensions?: string | null;
  year_created?: number | null;
  is_for_sale?: boolean;
  shop_url?: string | null;
  price_range?: string | null;
  updated_at?: string;
}

// gallery_items table - junction table linking artworks to sections with ordering
export interface GalleryItem {
  id: string;
  section_id: string;
  artwork_id: string;
  display_order: number;
  created_at: string;
}

export interface GalleryItemInsert {
  id?: string;
  section_id: string;
  artwork_id: string;
  display_order: number;
  created_at?: string;
}

export interface GalleryItemUpdate {
  id?: string;
  section_id?: string;
  artwork_id?: string;
  display_order?: number;
}

// gallery item with joined artwork data for queries
export interface GalleryItemWithArtwork extends GalleryItem {
  artwork: Artwork;
}

// site_settings table - key-value store for site configuration
export interface SiteSetting {
  key: string;
  value: Json;
  updated_at: string;
}

export interface SiteSettingInsert {
  key: string;
  value: Json;
  updated_at?: string;
}

export interface SiteSettingUpdate {
  key?: string;
  value?: Json;
  updated_at?: string;
}

// inquiries table - contact form submissions
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  inquiry_type: InquiryType;
  artwork_id: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface InquiryInsert {
  id?: string;
  name: string;
  email: string;
  inquiry_type: InquiryType;
  artwork_id?: string | null;
  message: string;
  status?: InquiryStatus;
  created_at?: string;
}

export interface InquiryUpdate {
  id?: string;
  name?: string;
  email?: string;
  inquiry_type?: InquiryType;
  artwork_id?: string | null;
  message?: string;
  status?: InquiryStatus;
}

// inquiry with joined artwork data for admin views
export interface InquiryWithArtwork extends Inquiry {
  artwork: Artwork | null;
}

// json type for site_settings value field
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// complete database schema type for supabase client
export interface Database {
  public: {
    Tables: {
      sections: {
        Row: Section;
        Insert: SectionInsert;
        Update: SectionUpdate;
      };
      artworks: {
        Row: Artwork;
        Insert: ArtworkInsert;
        Update: ArtworkUpdate;
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: GalleryItemInsert;
        Update: GalleryItemUpdate;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: SiteSettingInsert;
        Update: SiteSettingUpdate;
      };
      inquiries: {
        Row: Inquiry;
        Insert: InquiryInsert;
        Update: InquiryUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      media_type: MediaType;
      inquiry_type: InquiryType;
      inquiry_status: InquiryStatus;
    };
  };
}

// helper type for extracting table types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// enum helper type
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
