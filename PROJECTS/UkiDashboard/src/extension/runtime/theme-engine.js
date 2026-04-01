const THEME_CONFIGS = {
  command: {
    modeClass: 'theme-command',
    hue: 0,
    panelAlpha: 0.9
  },
  amber: {
    modeClass: 'theme-amber',
    hue: -16,
    panelAlpha: 0.93
  },
  civic: {
    modeClass: 'theme-civic',
    hue: 18,
    panelAlpha: 0.88
  }
};

const HERO_PROFILES = {
  off: { themeId: null, effectsLevel: null, profileClass: null },
  sentinel: { themeId: 'civic', effectsLevel: 65, profileClass: 'hero-profile-sentinel' },
  rescue: { themeId: 'amber', effectsLevel: 45, profileClass: 'hero-profile-rescue' },
  blackout: { themeId: 'command', effectsLevel: 15, profileClass: 'hero-profile-blackout' }
};

export function applyThemeConfig(root, state) {
  const themeId = state.themeId;
  const effectsLevel = state.effectsLevel;
  const heroProfile = state.heroProfile || 'off';
  const highContrast = Boolean(state.highContrast);
  const reducedMotion = Boolean(state.reducedMotion);
  const performanceMode = Boolean(state.performanceMode);

  const hero = HERO_PROFILES[heroProfile] || HERO_PROFILES.off;
  const resolvedThemeId = hero.themeId || themeId;
  const resolvedEffectsLevel = hero.effectsLevel != null ? hero.effectsLevel : effectsLevel;
  const selected = THEME_CONFIGS[resolvedThemeId] || THEME_CONFIGS.command;

  root.classList.remove('theme-command', 'theme-amber', 'theme-civic');
  root.classList.add(selected.modeClass);
  root.classList.remove('hero-profile-sentinel', 'hero-profile-rescue', 'hero-profile-blackout');
  if (hero.profileClass) root.classList.add(hero.profileClass);
  root.classList.toggle('high-contrast', highContrast);
  root.classList.toggle('reduced-motion', reducedMotion);
  root.classList.toggle('performance-mode', performanceMode);

  const clampedEffects = Math.max(0, Math.min(100, Number(resolvedEffectsLevel) || 0));
  const effectiveEffects = performanceMode ? Math.min(35, clampedEffects) : clampedEffects;

  root.style.setProperty('--effects-level', `${effectiveEffects}`);
  root.style.setProperty('--theme-hue-adjust', `${selected.hue}deg`);
  root.style.setProperty('--panel-alpha', `${selected.panelAlpha}`);

  return {
    ...state,
    themeId: resolvedThemeId,
    effectsLevel: clampedEffects,
    heroProfile,
    highContrast,
    reducedMotion,
    performanceMode,
    effectiveEffects
  };
}
