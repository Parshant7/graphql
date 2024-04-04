import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { role } from './enums/role.enum';

registerEnumType(role, {
    name: 'role',
});

@ObjectType()
export class user{
    @Field()
    _id: string;

    @Field()
    first_name: string;

    @Field()
    last_name: string;

    @Field()
    email: string;

    @Field(type=>role)
    role: role;

    @Field()
    password: string;
}