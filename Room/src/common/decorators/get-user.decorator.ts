import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authorization = request.headers.authorization;
  let user;

  if (authorization == null) {
    return null;
  }

  const token = authorization.split(' ');

  if (token.length < 2) {
    return false;
  } else if (token[0] !== 'Bearer') {
    return false;
  }

  try {
    user = jwt.verify(token[1], process.env.JWT_AUTH_SECRET);
    return user;
  } catch (err) {
    throw new UnauthorizedException(err);
  }
});
