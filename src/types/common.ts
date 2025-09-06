export type Theme = "light" | "dark";

export interface NavItem {
  href: string;
  label: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Interval {
  value: string;
  label: string;
}
