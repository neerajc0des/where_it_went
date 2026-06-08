export const appName = "Where It Went";
export const appTagline = "";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1";

export const ENDPOINTS = {
  // auth
  auth: {
    register:           '/auth/register',
    login:              '/auth/login',
    logout:             '/auth/logout',
    refresh:            '/auth/refresh',
    me:                 '/auth/me',
    verifyEmail:        '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    forgotPassword:     '/auth/forgot-password',
    resetPassword:      '/auth/reset-password',
    sessions:           '/auth/sessions',
    google:             '/auth/google',
  },
  categories: {
    base: '/categories',
  },
  accounts: {
    base: '/accounts',
  }
} as const;


export const STORAGE_KEYS = {
  accessToken:  'accessToken',
  refreshToken: 'refreshToken',
  user:         'user',
} as const;

export const MAX_SESSIONS = 4;


export const MOOD_EMOJI: Record<string, string> = {
  HAPPY:   '😊',
  NEUTRAL: '😐',
  ANXIOUS: '😰',
  STRESSED:'😤',
  SAD:     '😢',
};

export const MOOD_COLOR: Record<string, string> = {
  HAPPY:   '#51CF66',
  NEUTRAL: '#A0A0B0',
  ANXIOUS: '#FF922B',
  STRESSED:'#FF6B6B',
  SAD:     '#339AF0',
};

export const NUDGE_COLOR: Record<string, string> = {
  BALANCE_WARNING:     '#FF6B6B',
  MOOD_SPENDING:       '#6C63FF',
  IMPULSE_PATTERN:     '#FF922B',
  PERSONALITY_INSIGHT: '#339AF0',
};

export const NUDGE_ICON: Record<string, string> = {
  BALANCE_WARNING:     'alert-triangle',
  MOOD_SPENDING:       'brain',
  IMPULSE_PATTERN:     'zap',
  PERSONALITY_INSIGHT: 'star',
};
