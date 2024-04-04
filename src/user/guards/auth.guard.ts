import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { role as RoleType } from '../enums/role.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorators';

@Injectable()
export class AuthorizeUser implements CanActivate {
  constructor(
    @InjectModel('users') private User,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const token = req.cookies['access_token'];
    console.log('token received ', token);
    if (!token) {
      throw new GraphQLError('Token not received', {
        extensions: {
          code: 400,
        },
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'this is the secret key',
      });
      console.log("payload received", payload )
      const user = await this.User.findById(payload?._id);
      if (!user) {
        throw new GraphQLError('unauthorized', {
          extensions: {
            code: 400,
          },
        });
      }
      console.log("here is the user", user);
      req.user = user;

      if (!requiredRoles) {
        return true;
      }
      // if user satisfy the role
      if (
        requiredRoles?.length &&
        !requiredRoles.some((role) => role==user.role)
      ) {
        console.log('user does not satisfy the role');
        throw new GraphQLError('User does not satisfy the role', {
            extensions: {
              code: 400,
            },
        });
      }
    } catch (error) {
      console.log(error);
      throw new GraphQLError('unauthorized', {
        extensions: {
          code: 400,
        },
      });
    }
    return true;
  }
}
