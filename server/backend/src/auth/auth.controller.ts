import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: Record<string, any>) {
    const { username, password } = signInDto;
    console.log({ username, password });
    const message = await this.authService.signIn(username, password);
    console.log(message);
    return message;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() signUpDto: Record<string, any>) {
    const { username, email, password, role } = signUpDto;
    const message = await this.authService.signUp(
      username,
      email,
      password,
      role,
    );
    console.log(message);
    return message;
  }
}
