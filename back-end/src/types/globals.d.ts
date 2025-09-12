declare global {
  interface AuthenticatedRequest extends Request {
    user: JWTPayload;
  }

  interface JWTPayload {
    userId: number;
    username: string;
    roleIds?: number[];
    iat?: number;
    exp?: number;
  }
}

export {};
