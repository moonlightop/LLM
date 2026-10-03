import { IsInt } from "class-validator";

export class UrlencodedDto {
  name: string;
  @IsInt({ message: "age must be a number" })
  age: number;
}