import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.accountService.findOne(username);
   
    if (user != null) {
      if (user?.password !== pass) {
        return { message: 'Wrong username or password!', access_token: null };
      }

      const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
        exp_time: 3600,// đơn vị giây
      };
      const access_token = await this.jwtService.signAsync(payload);
      return { message: 'Login successful!', access_token: access_token , data: payload};
    }
    return { message: 'Wrong username or password!', access_token: null };
  }

  async signUp(
    username: string,
    email: string,
    password: string,
    role: string,
  ): Promise<any> {
    const user = await this.accountService.findOne(username);
    if (user != null) {
      return { message: 'Account already exists!', data: null };
    }
    const createAccountDto: CreateAccountDto = {
      username,
      email,
      password,
      role,
    };

    const newUser = await this.accountService.create(createAccountDto);
    
    return { message: 'Sign up successful!', data: newUser };
  }
}
