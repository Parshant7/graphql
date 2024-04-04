import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
  Context,
  GraphQLExecutionContext,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { role } from './enums/role.enum';
import { user } from './user.model';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { AuthorizeUser } from './guards/auth.guard';
import { RoleType } from './decorators/role.decorators';

@Resolver((of) => user)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Query(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context('res') res: Response,
  ) {
    return await this.userService.login(email, password, res);
  }

  @Mutation((returns) => user)
  async register(
    @Args('first_name') first_name: string,
    @Args('last_name') last_name: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role') role: role,
  ): Promise<user> {
    return await this.userService.createUser(
      first_name,
      last_name,
      email,
      password,
      role,
    );
  }

  //for admin only
  @Query(() => user)
  @UseGuards(AuthorizeUser)
  @RoleType(role.Admin)
  async findUser(@Args('id') id: string) {
    return await this.userService.findOne(id);
  }

  //for admin only
  @Query(() => [user])
  @UseGuards(AuthorizeUser)
  @RoleType(role.Admin)
  async listUsers(@Context('req') req: Request) {
    return await this.userService.listUsers(req);
  }
}
