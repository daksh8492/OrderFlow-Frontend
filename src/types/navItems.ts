import type { LucideIcon } from "lucide-react";

export type NavItem = {
    title: string;
    path?: string;
    icon: LucideIcon;
    roles: string[];
    children?: NavItem[];
};