import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  UseFilters,
  ValidationPipe,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
} from "@nestjs/common";
import { UserService } from "./user.service.js";
import { UrlencodedDto } from "./dto/urlencoded.dto.js";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ValidatePipe } from "../validate.pipe.js";
import { TestFilter } from "../test.filter.js";

@Controller("user")
// @UseFilters(TestFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("urlParam/:id")
  findUrlParam(@Param("id") id: string) {
    return `This action returns a #${id} user`;
  }

  @Get("query")
  findQuery(@Query("name") name: string) {
    return `This action returns a #${name} user`;
  }

  @Post("formUrlencoded")
  findFormUrlencoded(@Body() body: UrlencodedDto) {
    return `urlencoded body: ${JSON.stringify(body)}`;
  }

  @Post("json")
  findJson(@Body(new ValidationPipe()) body: UrlencodedDto) {
    return `json body: ${JSON.stringify(body)}`;
  }

  @Post("formData")
  @UseInterceptors(FileFieldsInterceptor([
    { name: "file1", maxCount: 2 },
    { name: "file2", maxCount: 2 },
  ], {
    dest: "./uploads",
  }))
  findFormData(
    @UploadedFiles(new ParseFilePipe({
      // exceptionFactory() {
      //   throw new HttpException("File validation failed", 404);
      // },
      validators: [
        // new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
        new FileTypeValidator({ fileType: 'image/png',  fallbackToMimetype: true }),
      ]
    })) files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    console.log(files);
    return `formData body: ${JSON.stringify(body)}`;
  }
}
