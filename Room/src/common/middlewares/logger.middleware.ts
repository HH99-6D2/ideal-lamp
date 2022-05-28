import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.verbose(
        `${req.method} - ${res.statusCode} reqQuery: ${JSON.stringify(
          req.query,
        )}, reqBody: ${JSON.stringify(req.body)}`,
        req.originalUrl,
      );
    });
    next();
  }
}
