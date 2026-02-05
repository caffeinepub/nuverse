import { CreatorSlot, CreatorSlotsState } from '../types/creatorSlots';

const STORAGE_KEY = 'air_creator_slots';
const DEFAULT_CAPACITY = 10;

export const creatorSlotsStorage = {
  // Load all slots from localStorage
  load(): CreatorSlotsState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load creator slots:', error);
    }
    return {
      slots: [],
      totalCapacity: DEFAULT_CAPACITY,
    };
  },

  // Save all slots to localStorage
  save(state: CreatorSlotsState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save creator slots:', error);
    }
  },

  // Add a new slot
  addSlot(slot: CreatorSlot): void {
    const state = this.load();
    state.slots.push(slot);
    this.save(state);
  },

  // Update an existing slot
  updateSlot(slotId: string, updates: Partial<CreatorSlot>): void {
    const state = this.load();
    const index = state.slots.findIndex((s) => s.id === slotId);
    if (index !== -1) {
      state.slots[index] = {
        ...state.slots[index],
        ...updates,
        updatedAt: Date.now(),
      };
      this.save(state);
    }
  },

  // Delete a slot
  deleteSlot(slotId: string): void {
    const state = this.load();
    state.slots = state.slots.filter((s) => s.id !== slotId);
    this.save(state);
  },

  // Get a single slot by ID
  getSlot(slotId: string): CreatorSlot | null {
    const state = this.load();
    return state.slots.find((s) => s.id === slotId) || null;
  },

  // Get all slots
  getAllSlots(): CreatorSlot[] {
    const state = this.load();
    return state.slots;
  },

  // Get capacity info
  getCapacity(): { used: number; total: number } {
    const state = this.load();
    return {
      used: state.slots.length,
      total: state.totalCapacity,
    };
  },
};
