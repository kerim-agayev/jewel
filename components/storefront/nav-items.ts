/**
 * Single source for both the desktop header and the mobile bottom tab bar —
 * see CLAUDE.md "Navigation". "Kateqoriyalar" is a dropdown/sheet trigger
 * (lists categories fetched at render time), not a route of its own — there
 * is no dedicated categories index page in CLAUDE.md's routing table.
 * Search is intentionally omitted this wave (see docs/phase_1/decisions.md).
 */
export interface NavItem {
  key: "home" | "lookbook" | "calculator" | "about";
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "lookbook", href: "/lookbook" },
  { key: "calculator", href: "/hesabla" },
  { key: "about", href: "/haqqimizda" },
];
