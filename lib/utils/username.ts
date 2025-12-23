/**
 * Generate a random username
 * Format: user_XXXX (where XXXX is random alphanumeric)
 */
export function generateRandomUsername(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `user_${randomSuffix}`;
}

/**
 * Check if username is valid format
 * Allows: letters, numbers, underscores, and dashes
 * Min 3, max 50 characters
 */
export function isValidUsernameFormat(username: string): boolean {
  if (username.length < 3 || username.length > 50) {
    return false;
  }
  // Allow letters, numbers, underscores, and dashes
  return /^[a-zA-Z0-9_-]+$/.test(username);
}

/**
 * Sanitize username input (lowercase, remove invalid chars)
 */
export function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .substring(0, 50);
}

/**
 * Check if user can change username (30-day cooldown)
 */
export function canChangeUsername(lastChangeAt: Date | null): {
  canChange: boolean;
  daysRemaining?: number;
} {
  if (!lastChangeAt) {
    return { canChange: true };
  }

  const daysSinceChange = Math.floor(
    (Date.now() - lastChangeAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceChange >= 30) {
    return { canChange: true };
  }

  return {
    canChange: false,
    daysRemaining: 30 - daysSinceChange,
  };
}
