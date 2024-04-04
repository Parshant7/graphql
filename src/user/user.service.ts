import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { role } from './enums/role.enum';

@Injectable() 
export class UserService {
  constructor(
    @InjectModel('users') private User,
    private jwtService: JwtService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.User.findOne({email, password});
    if(!user){
      throw new GraphQLError("Wrong Credentials", {
        extensions: {
          code: 400
        }
      });
    };
    const payload = { _id: user._id, role: user.role };

    const access_token = await this.jwtService.signAsync(payload);
    console.log("this is the token ",access_token);
    res.cookie("access_token", access_token);
    return "user is authenticated";
  }
  async createUser(first_name: string, last_name: string, email: string, password: string, role: role){
    const userExist = await this.User.findOne({email: email});
    if(userExist){
      throw new GraphQLError(
        "Email already Exists",
        {
          extensions: {
            code: 409
          }
        }
      )
    }
    const new_user = await this.User.create({first_name, last_name, email, password, role});
    return new_user;
  }

  async findOne(id: string) {
    return await this.User.findOne({ _id: id });
  }

  async listUsers(req: Request) {
    return await this.User.find();
  }

}
