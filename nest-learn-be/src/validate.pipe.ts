import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { AppService } from "./app.service.js";


@Injectable()
export class ValidatePipe implements PipeTransform {
  constructor(private readonly appService: AppService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata.data)
    if (Number.isNaN(+value)) {
      throw new BadRequestException("value must be a number");
    }

    return value > 10 ? value : 10;
  }
}