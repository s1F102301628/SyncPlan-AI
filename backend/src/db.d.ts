export function findUserByGoogleId(googleId: string): any;
export function findUserByEmail(email: string): any;
export function createUserByGoogle(googleId: string, email: string | null, name: string | null): any;
export function findOrCreateByGoogle(googleId: string, email: string | null, name: string | null): any;
export function updateUserTokensById(userId: number | string, accessToken: string | null, refreshToken: string | null, expiryDate: number | null): any;
export function findUserById(id: number | string): any;
