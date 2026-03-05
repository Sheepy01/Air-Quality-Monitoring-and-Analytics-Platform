import { create } from 'zustand'

interface FilterState {
  selectedDistrict: string | null
  selectedYear: number | null
  selectedStation: string | null
  setDistrict: (district: string | null) => void
  setYear: (year: number | null) => void
  setStation: (station: string | null) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedDistrict: null,
  selectedYear: null,
  selectedStation: null,
  
  setDistrict: (district) => set({ selectedDistrict: district }),
  setYear: (year) => set({ selectedYear: year }),
  setStation: (station) => set({ selectedStation: station }),
  resetFilters: () => set({
    selectedDistrict: null,
    selectedYear: null,
    selectedStation: null,
  }),
}))