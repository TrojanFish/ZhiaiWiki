/**
 * 规范化并合并 classNames，自动剔除首尾换行与多余空格
 * 彻底杜绝 Next.js 16 (Turbopack) 与 React 19 在 SSR 水合时的 class 属性不一致 (Hydration Mismatch)
 */
type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    }
  }

  return classes.join(" ").replace(/\s+/g, " ").trim();
}

export default cn;
