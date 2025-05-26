// src/posts/dto/create-post.dto.ts
import { IsNotEmpty, IsString, MinLength, IsUrl, IsOptional, IsISO8601 } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  imageUrl?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'La fecha debe estar en formato ISO 8601 (YYYY-MM-DD)' })
  createdAt?: string;

  // Opcional: podrías añadir un campo para el autor, fecha, etc.
  // @IsString()
  // author?: string;
}
