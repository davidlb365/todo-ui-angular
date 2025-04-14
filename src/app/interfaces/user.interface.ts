export interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

export type LoginUser = Pick<User, 'username' | 'password'>;

export interface LoginResponse {
  accessToken: string | null;
  tokenType: string | null;
  role: string | null;
}

export interface AuthInfo {
  authToken: string | null;
  authenticatedUser: string | null;
  role: string | null;
}
