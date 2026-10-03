import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";


@Catch(BadRequestException)
export class TestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    if (host.getType() === "http") {
    const response = host.switchToHttp().getResponse();
      response.status(500).json({
        message: exception.message,
        statusCode: 400
      })
    } else if (host.getType() === "ws") {

    } else if (host.getType() === "rpc") {
  
    }
  }
}