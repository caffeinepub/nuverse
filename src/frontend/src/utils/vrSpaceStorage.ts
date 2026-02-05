import { VRSpaceDraft, PublishedVRSpace } from '../types/vrSpaceBuilder';

const DRAFTS_KEY = 'vr_space_drafts';
const PUBLISHED_KEY = 'vr_space_published';

export const vrSpaceStorage = {
  // Draft operations
  saveDraft(draft: VRSpaceDraft): void {
    try {
      const drafts = this.getAllDrafts();
      const existingIndex = drafts.findIndex(d => d.id === draft.id);
      
      if (existingIndex >= 0) {
        drafts[existingIndex] = { ...draft, updatedAt: Date.now() };
      } else {
        drafts.push(draft);
      }
      
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  },

  getAllDrafts(): VRSpaceDraft[] {
    try {
      const data = localStorage.getItem(DRAFTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load drafts:', error);
      return [];
    }
  },

  getDraft(id: string): VRSpaceDraft | null {
    const drafts = this.getAllDrafts();
    return drafts.find(d => d.id === id) || null;
  },

  deleteDraft(id: string): void {
    try {
      const drafts = this.getAllDrafts().filter(d => d.id !== id);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  },

  // Published spaces operations
  publishSpace(draft: VRSpaceDraft): PublishedVRSpace {
    try {
      const published = this.getAllPublished();
      
      const publishedSpace: PublishedVRSpace = {
        ...draft,
        publishedAt: Date.now(),
        isLive: true,
        users: 0,
      };
      
      published.push(publishedSpace);
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published));
      
      return publishedSpace;
    } catch (error) {
      console.error('Failed to publish space:', error);
      throw error;
    }
  },

  getAllPublished(): PublishedVRSpace[] {
    try {
      const data = localStorage.getItem(PUBLISHED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load published spaces:', error);
      return [];
    }
  },

  getPublished(id: string): PublishedVRSpace | null {
    const published = this.getAllPublished();
    return published.find(p => p.id === id) || null;
  },

  deletePublished(id: string): void {
    try {
      const published = this.getAllPublished().filter(p => p.id !== id);
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published));
    } catch (error) {
      console.error('Failed to delete published space:', error);
    }
  },
};
