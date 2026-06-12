import { defaultInviteConfig, type InviteConfig } from "./inviteConfig";
import { inviteProfiles, type InviteProfileOverrides } from "./profiles";

function mergeInviteConfig(
  base: InviteConfig,
  overrides: InviteProfileOverrides
): InviteConfig {
  return {
    ...base,
    ...overrides,
    music: overrides.music ? { ...base.music, ...overrides.music } : base.music,
    contact: overrides.contact
      ? { ...base.contact, ...overrides.contact }
      : base.contact,
    pix: overrides.pix ? { ...base.pix, ...overrides.pix } : base.pix,
    stalking: overrides.stalking
      ? { ...base.stalking, ...overrides.stalking }
      : base.stalking,
    fun: overrides.fun
      ? {
          ...base.fun,
          ...overrides.fun,
          escapeHints: overrides.fun.escapeHints
            ? ({
                ...base.fun.escapeHints,
                ...overrides.fun.escapeHints,
              } as InviteConfig["fun"]["escapeHints"])
            : base.fun.escapeHints,
        }
      : base.fun,
    timePresets: overrides.timePresets ?? base.timePresets,
    placeOptions: overrides.placeOptions ?? base.placeOptions,
    noFines: overrides.noFines ?? base.noFines,
    noButtonMessages: overrides.noButtonMessages ?? base.noButtonMessages,
  };
}

export function getDefaultInviteConfig(): InviteConfig {
  return mergeInviteConfig(defaultInviteConfig, {});
}

export function getInviteConfigForSlug(slug: string): InviteConfig | null {
  const normalized = slug.trim().toLowerCase();
  const overrides = inviteProfiles[normalized];
  if (!overrides) return null;
  return mergeInviteConfig(defaultInviteConfig, overrides);
}

export function getProfileSlugs(): string[] {
  return Object.keys(inviteProfiles);
}
