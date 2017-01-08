import MaxConnections from './max_connections';

export const getHostname = (url, parser) => {
  if (!url) {
    return null;
  }
  // No parser since ours is based on document
  if (process.env.NODE_ENV === 'testing') {
    return url;
  }
  parser.href = url;
  return parser.hostname;
}

export const isBrowserSupported = () => {
  return MaxConnections.isBrowserSupported;
}

export default {
  getHostname,
  isBrowserSupported
}
