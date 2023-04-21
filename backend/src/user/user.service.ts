import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { signUpDto } from './dto/signUp.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: signUpDto) {}
}
