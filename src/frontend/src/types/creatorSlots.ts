export type ContentType = 'game' | 'vrSpace';

export type SlotStatus = 'reserved' | 'uploaded' | 'draft' | 'updating';

export interface CreatorSlot {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  status: SlotStatus;
  thumbnailUrl?: string;
  version?: string;
  createdAt: number;
  updatedAt: number;
  analytics: {
    plays: number;
    rating: number;
    popularity: number;
  };
}

export interface CreatorSlotsState {
  slots: CreatorSlot[];
  totalCapacity: number;
}
