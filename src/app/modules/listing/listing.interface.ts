export interface IListing {
  title: string;
  description: string;
  city: string;
  category: string;
  price: number;
  duration: number;
  meetingPoint: string;
  maxGroup: number;
  images?: string[];
  guideId: string;
}

export interface IUpdateListing {
  title?: string;
  description?: string;
  city?: string;
  category?: string;
  price?: number;
  duration?: number;
  meetingPoint?: string;
  maxGroup?: number;
  images?: string[];
  isActive?: boolean;
}
