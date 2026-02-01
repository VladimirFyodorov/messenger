import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBlockDto {
  @IsUUID()
  blockedUserId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
