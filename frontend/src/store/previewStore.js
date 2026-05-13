import { create } from 'zustand';

const previewStore = create((set) => ({
  isPreviewMode: false,
  deviceType: 'desktop', // desktop, tablet, mobile
  zoomLevel: 100,

  setPreviewMode: (mode) => set({ isPreviewMode: mode }),
  setDeviceType: (type) => set({ deviceType: type }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
}));

export default previewStore;
