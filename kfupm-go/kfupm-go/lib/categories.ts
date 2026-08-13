import type { CategoryMeta, LocationCategory } from "@/types/location";

export const CATEGORY_META: Record<LocationCategory, CategoryMeta> = {
  academic: { id: "academic", label: "Buildings", color: "#007E40", icon: "Building2" },
  food: { id: "food", label: "Food", color: "#ea580c", icon: "UtensilsCrossed" },
  parking: { id: "parking", label: "Parking", color: "#525252", icon: "SquareParking" },
  mosque: { id: "mosque", label: "Mosques", color: "#0d9488", icon: "Landmark" },
  study: { id: "study", label: "Study", color: "#7c3aed", icon: "BookOpen" },
  service: { id: "service", label: "Services", color: "#0891b2", icon: "Wrench" },
  club: { id: "club", label: "Clubs", color: "#facc15", icon: "Users" },
  transit: { id: "transit", label: "Bus Stops", color: "#2563eb", icon: "Bus" },
  other: { id: "other", label: "Other", color: "#71717a", icon: "MapPin" },
};

export const QUICK_CATEGORIES: LocationCategory[] = [
  "academic",
  "food",
  "parking",
  "mosque",
  "study",
  "service",
  "club",
  "transit",
];
