import {
  HeartHandshake, Flower2, PersonStanding, ShoppingBag, Camera, Baby,
  Sparkles, Heart, Moon, Brain, Users, Droplet, Leaf, Stethoscope,
} from "lucide-react";

export const iconMap = {
  HeartHandshake, Flower2, PersonStanding, ShoppingBag, Camera, Baby,
  Sparkles, Heart, Moon, Brain, Users, Droplet, Leaf, Stethoscope,
};

export function ServiceIcon({ name, className, strokeWidth = 1.5 }) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
