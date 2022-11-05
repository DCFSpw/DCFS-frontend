export const PROVIDER_TYPE = {
  SFTP: 1,
  GOOGLE_DRIVE: 2,
  ONE_DRIVE: 3,
  FTP: 4,
}

const OAUTH_PROVIDERS = [PROVIDER_TYPE.GOOGLE_DRIVE, PROVIDER_TYPE.ONE_DRIVE]

export const isOauth = (providerType) => OAUTH_PROVIDERS.includes(providerType)
