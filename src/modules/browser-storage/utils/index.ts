import {
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  ShieldQuestion,
  type LucideIcon,
} from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/components/ui/badge';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

interface SameSiteInfo {
  label: string;
  icon: LucideIcon;
  variant: BadgeVariant;
}

const getSameSite = (
  sameSite: chrome.cookies.Cookie['sameSite'] | undefined,
): SameSiteInfo => {
  switch (sameSite) {
    case 'strict':
      return {
        label: 'Strict',
        icon: ShieldCheck,
        variant: 'success',
      };

    case 'lax':
      return {
        label: 'Lax',
        icon: ShieldAlert,
        variant: 'outline',
      };

    case 'no_restriction':
      return {
        label: 'None',
        icon: ShieldOff,
        variant: 'warning',
      };

    case 'unspecified':
    default:
      return {
        label: 'Unspecified',
        icon: ShieldQuestion,
        variant: 'outline',
      };
  }
};

export { getSameSite };
export type { SameSiteInfo };
