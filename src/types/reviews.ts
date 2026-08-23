export interface GooglePlaceBusiness {
  name: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri: string;
  formattedAddress?: string;
  placeId?: string;
}

export interface GooglePlaceReviewItem {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorUri?: string;
  rating: number;
  comment: string;
  publishTime?: string;
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
}

export interface ReviewsApiResponse {
  business?: GooglePlaceBusiness;
  rating: number;
  averageRating: number;
  totalReviews: number;
  totalReviewCount: number;
  displayedCount: number;
  reviews: GooglePlaceReviewItem[];
  googleMapsUri?: string;
  locationTitle?: string;
  isPlacesApi?: boolean;
  error?: string;
  diagnosticHint?: string;
}
