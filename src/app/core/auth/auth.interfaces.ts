export interface AuthResponseData {
  id: number;
  token_type: string;
  expires_in: string;
  access_token: string;
  refresh_token: string;
}

export interface AuthTokenStructure {
  aud?: string;
  exp?: number;
  iat?: number;
  jti?: string;
  nbf?: number;
  scopes?: any[];
  sub?: string;
  user_id: number;
  user_name: string;
  user_role?: any;
}
