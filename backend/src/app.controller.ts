import { Controller, Get, Redirect } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

@Controller()
@ApiExcludeController()
export class AppController {
    @Get("health")
    getHealth(): string {
        return "OK";
    }

    @Get()
    @Redirect("/docs", 302)
    redirectToDocs() {}
}
