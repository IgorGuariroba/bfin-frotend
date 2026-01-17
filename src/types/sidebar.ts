export type SidebarState = 'hidden' | 'collapsed' | 'expanded';

export interface SidebarConfig {
  // Mobile behavior
  mobileDefaultState: SidebarState;
  hiddenOnMobile: boolean;

  // Desktop behavior
  desktopDefaultState: SidebarState;

  // Animation settings
  slideAnimationDuration: number;
  backdropOpacity: number;
}

export const defaultSidebarConfig: SidebarConfig = {
  mobileDefaultState: 'hidden',
  hiddenOnMobile: true,
  desktopDefaultState: 'collapsed',
  slideAnimationDuration: 300,
  backdropOpacity: 0.6,
};