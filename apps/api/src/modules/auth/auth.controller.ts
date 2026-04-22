import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  initData: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('telegram')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.initData);
  }
}
