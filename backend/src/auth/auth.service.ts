import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginInput, RegisterInput } from './dto/auth.inputs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async register(input: RegisterInput) {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) throw new BadRequestException('Email is already registered');
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.usersService.create({ ...input, passwordHash });
    return { accessToken: this.sign(user.id), user };
  }

  async login(input: LoginInput) {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return { accessToken: this.sign(user.id), user };
  }

  private sign(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }
}
