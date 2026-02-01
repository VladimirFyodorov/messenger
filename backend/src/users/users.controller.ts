import { Request as ExpressRequest } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.usersService.getProfile(req.user.id);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch('me')
  async updateProfile(@Request() req: ExpressRequest & { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get('me/settings')
  async getSettings(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.usersService.getSettings(req.user.id);
  }

  @Patch('me/settings')
  async updateSettings(@Request() req: ExpressRequest & { user: { id: string } }, @Body() settings: Record<string, any>) {
    return this.usersService.updateSettings(req.user.id, settings);
  }
}
