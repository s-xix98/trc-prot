import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtTwoFaAuthGuard extends AuthGuard('jwt-two-fa') {}
