// Lightweight project logger: wrap console for consistency.
const logger = {
  info: (...args) => console.log('[info]', ...args),
  debug: (...args) => console.log('[debug]', ...args),
  warn: (...args) => console.warn('[warn]', ...args),
  error: (...args) => console.error('[error]', ...args)
};

export default logger;


