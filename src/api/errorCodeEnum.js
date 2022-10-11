export const ErrorCodeEnum = {
  AUTH_JWT_FAILURE: 'AUTH-011',
  AUTH_JWT_MISSING: 'AUTH-012',
  AUTH_JWT_INVALID: 'AUTH-013',
  AUTH_JWT_EXPIRED: 'AUTH-014',
}

export const getJwtErrorCodes = () => [
  ErrorCodeEnum.AUTH_JWT_EXPIRED,
  ErrorCodeEnum.AUTH_JWT_MISSING,
  ErrorCodeEnum.AUTH_JWT_INVALID,
  ErrorCodeEnum.AUTH_JWT_EXPIRED,
]
