import 'dotenv/config';

import { LoggerOptionsWithTransports } from 'express-winston';
import { format, LoggerOptions, transports } from 'winston';

export const optionsForGlobalLogger = (): LoggerOptions => ({
  level: process.env.LOGGING_LEVEL || 'error',
  exitOnError: false,
  format: format.combine(format.timestamp(), format.json()),
});
export const optionsForExpressLogger = (): LoggerOptionsWithTransports => ({
  transports: [new transports.Console()],
  format: format.combine(format.colorize(), format.json()),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // optional: allows to skip some log messages based on request and/or response
});
