import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AppConfig {
  @IsOptional()
  @IsNumber()
  port?: number;

  @IsOptional()
  @IsString()
  env?: string;
}

export class DbConfig {
  @IsOptional()
  @IsString()
  host?: string;

  @IsOptional()
  @IsNumber()
  port?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  database?: string;

  @IsOptional()
  @IsBoolean()
  synchronize?: boolean;
}

export class RedisConfig {
  @IsOptional()
  @IsString()
  host?: string;

  @IsOptional()
  @IsNumber()
  port?: number;

  @IsOptional()
  @IsString()
  password?: string;
}

export class JwtConfig {
  @IsOptional()
  @IsString()
  secret?: string;

  @IsOptional()
  @IsString()
  expiresIn?: string;

  @IsOptional()
  @IsString()
  refreshExpiresIn?: string;
}

export class GoogleOAuthConfig {
  @IsOptional()
  @IsString()
  clientID?: string;

  @IsOptional()
  @IsString()
  clientSecret?: string;

  @IsOptional()
  @IsString()
  callbackURL?: string;
}

export class AuthConfig {
  @ValidateNested()
  @Type(() => JwtConfig)
  jwt!: JwtConfig;

  @ValidateNested()
  @Type(() => GoogleOAuthConfig)
  google!: GoogleOAuthConfig;

  @IsOptional()
  @IsString()
  oauthSuccessRedirectUrl?: string;
}

export class CorsConfig {
  @IsOptional()
  @IsString()
  origin?: string;
}

export class FilesConfig {
  @IsOptional()
  @IsString()
  uploadDir?: string;
}

export class InfraConfig {
  @ValidateNested()
  @Type(() => DbConfig)
  db!: DbConfig;

  @ValidateNested()
  @Type(() => RedisConfig)
  redis!: RedisConfig;
}

export class Config {
  @ValidateNested()
  @Type(() => AppConfig)
  app!: AppConfig;

  @ValidateNested()
  @Type(() => CorsConfig)
  cors!: CorsConfig;

  @ValidateNested()
  @Type(() => InfraConfig)
  infra!: InfraConfig;

  @ValidateNested()
  @Type(() => AuthConfig)
  auth!: AuthConfig;

  @ValidateNested()
  @Type(() => FilesConfig)
  files!: FilesConfig;
}
