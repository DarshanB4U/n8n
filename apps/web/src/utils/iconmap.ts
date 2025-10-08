// src/utils/iconMap.ts
import * as Lucide from "lucide-react";
import { Icon as LucideIconType } from "lucide-react";

export function getIconComponent(
  iconName?: string
): React.ComponentType<any> | null {
  if (!iconName) return null;
  // explicit lookup on the imported lucide object
  const Icon = (Lucide as any)[iconName];
  return Icon ?? null;
}
