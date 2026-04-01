import { defaultLayout } from './layout-engine.js';

export function createLayoutProfileManager() {
  return {
    ensureProfiles(rawProfiles) {
      if (Array.isArray(rawProfiles) && rawProfiles.length) return rawProfiles;
      return [{
        id: 'profile-default',
        name: 'Default Layout',
        widgets: defaultLayout(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    },

    upsertProfile(profiles, profileInput) {
      const now = new Date().toISOString();
      const existing = profiles.find((entry) => entry.id === profileInput.id);
      if (existing) {
        return profiles.map((entry) => entry.id === profileInput.id
          ? { ...entry, ...profileInput, updatedAt: now }
          : entry);
      }

      return [{
        ...profileInput,
        id: profileInput.id || `profile-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: now,
        updatedAt: now
      }, ...profiles];
    },

    deleteProfile(profiles, profileId) {
      const next = profiles.filter((entry) => entry.id !== profileId);
      return next.length ? next : this.ensureProfiles([]);
    }
  };
}
