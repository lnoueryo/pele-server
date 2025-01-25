export type CommonErrorCode =
  | 'validation'
  | 'unauthorized'
  | 'permission-denied'
  | 'forbidden'
  | 'internal'
  | 'not-found'
  | 'too-many-requests'

export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message)
  }
  abstract getCommonErrorCode(): CommonErrorCode
}
