export interface User {
    id: number;
    email: string;
    username: string;
  }
  
  export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }