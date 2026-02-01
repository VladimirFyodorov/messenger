import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { ChatType } from '../entities/chat.entity';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(ChatType)
  type: ChatType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  memberIds: string[];
}
