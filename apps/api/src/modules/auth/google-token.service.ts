import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.js";

export type VerifiedGoogleUser = {
  providerAccountId: string;
  email: string;
  name?: string;
  picture?: string;
};

export class GoogleTokenVerificationError extends Error {
  constructor(message = "Invalid Google ID token") {
    super(message);
    this.name = "GoogleTokenVerificationError";
  }
}

export class GoogleTokenService {
  private readonly client = new OAuth2Client();

  async verifyIdToken(idToken: string): Promise<VerifiedGoogleUser> {
    if (!idToken || typeof idToken !== "string" || idToken.length > 16_384) {
      throw new GoogleTokenVerificationError();
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: env.googleClientId,
      });
      const payload = ticket.getPayload();

      if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        payload.email_verified !== true ||
        !this.isGoogleIssuer(payload.iss)
      ) {
        throw new GoogleTokenVerificationError();
      }

      return {
        providerAccountId: payload.sub,
        email: payload.email.trim().toLowerCase(),
        ...(payload.name ? { name: payload.name } : {}),
        ...(payload.picture ? { picture: payload.picture } : {}),
      };
    } catch (error) {
      if (error instanceof GoogleTokenVerificationError) {
        throw error;
      }

      throw new GoogleTokenVerificationError();
    }
  }

  private isGoogleIssuer(issuer: string | undefined): boolean {
    return (
      issuer === "accounts.google.com" ||
      issuer === "https://accounts.google.com"
    );
  }
}
