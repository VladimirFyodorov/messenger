import { IsEnum } from 'class-validator';

import { ChatRole } from '../entities/chat-member.entity';

export class UpdateMemberRoleDto {
  @IsEnum(ChatRole)
  role: ChatRole;
}
