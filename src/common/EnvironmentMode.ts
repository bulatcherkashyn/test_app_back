export enum EnvironmentModeTypes {
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export function isTest(): boolean {
  return process.env.NODE_ENV === EnvironmentModeTypes.TEST;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === EnvironmentModeTypes.PRODUCTION;
}

export function isDevelopment(): boolean {
  return !isTest() && !isProduction();
}

export function getSimpleName(): string {
  if (isTest()) {
    return EnvironmentModeTypes.TEST;
  } else if (isProduction()) {
    return EnvironmentModeTypes.PRODUCTION;
  } else {
    return EnvironmentModeTypes.DEVELOPMENT;
  }
}
