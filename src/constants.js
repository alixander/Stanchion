export const RetryOptions = {
  NONE: '@@STANCHION_RETRY_NONE',
  SIMPLE: '@@STANCHION_RETRY_SIMPLE',
  EXPONENTIAL_BACKOFF: '@@STANCHION_EXPONENTIAL_BACKOFF'
};

export const LogLevels = {
  INFO: '@@STANCHION_INFO',
  ERROR: '@@STANCHION_ERROR'
};

export const DEFAULT_MAX_OPEN_CONNECTIONS = 10;
export const DEFAULT_MAX_CONNECTIONS_PER_HOSTNAME = 6;

export default {
  RetryOptions,
  LogLevels,
  DEFAULT_MAX_OPEN_CONNECTIONS,
  DEFAULT_MAX_CONNECTIONS_PER_HOSTNAME
};