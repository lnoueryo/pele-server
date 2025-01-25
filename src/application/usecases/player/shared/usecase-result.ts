import { CommonErrorCode } from 'src/domain/repositories/shared/domain-error.interface'

export type UsecaseResult<T, U extends CommonErrorCode> =
  | {
      error: {
        type: U
        message: string
      }
    }
  | { success: T }
