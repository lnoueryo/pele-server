import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export class AuthUserRequest {
  public readonly id: string
  public readonly email: string
  public readonly name: string
  constructor(decodedIdToken: DecodedIdToken) {
    this.id = decodedIdToken.uid
    this.email = decodedIdToken.email
    this.name = decodedIdToken.displayName
  }
}
