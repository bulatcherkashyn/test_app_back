import { isDevelopment } from '@app/common/EnvironmentMode';
import { optionsForExpressLogger, optionsForGlobalLogger } from '@app/config/loggerConfig';
import { Handler } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import * as ExpressWinston from 'express-winston';
import { createLogger, format, Logger, transports } from 'winston';

export class LoggerFactory {
  private static createBasicLogger(): Logger {
    return createLogger(optionsForGlobalLogger());
  }

  private static prebrewConsole(logger: Logger): void {
    const errorStackTracerFormat = format((info) => {
      if (info.stack) {
        info.message = `${info.message}\n> ${info.stack}`;
        delete info.stack;
      }
      return info;
    });

    logger.add(
      new transports.Console({
        format: format.combine(errorStackTracerFormat(), format.colorize(), format.simple()),
      }),
    );

    logger.level = process.env.LOGGING_LEVEL || 'debug';
  }

  public static getLogger(): Logger {
    const logger = LoggerFactory.createBasicLogger();

    if (isDevelopment() || process.env.LOGGING_CONSOLE_ENABLED === 'true') {
      LoggerFactory.prebrewConsole(logger);
    }

    return logger;
  }

  public static getExpressLogger(): Handler {
    if (process.env.LOGGING_FILES_ENABLED === 'false') {
      return (req: Request, res: Response, next: NextFunction): void => {
        next();
      };
    }
    return ExpressWinston.logger(optionsForExpressLogger());
  }
}

export const logger = LoggerFactory.getLogger();
