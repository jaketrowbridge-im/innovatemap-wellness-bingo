import { Category, CATEGORY_COLORS } from "@/types";

export function CategoryBadge({ category, size = "sm" }: { category: Category; size?: "sm" | "xs" }) {
  const colors = CATEGORY_COLORS[category];
  return (
    <span
      className={`inline-block rounded-full text-white font-medium ${colors.badge} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[10px]"
      }`}
    >
      {category}
    </span>
  );
}
