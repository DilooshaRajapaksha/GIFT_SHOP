// price ranges used by the filter sidebar and by Shop Items to get min/max
// (kept in its own file because Vite's fast refresh wants .jsx files to only export components)
export const PRICE_RANGES = [
  { id: "0-2000", label: "Under Rs 2,000", min: 0, max: 2000 },
  { id: "2000-5000", label: "Rs 2,000 to 5,000", min: 2000, max: 5000 },
  { id: "5000+", label: "Over Rs 5,000", min: 5000, max: null },
];
