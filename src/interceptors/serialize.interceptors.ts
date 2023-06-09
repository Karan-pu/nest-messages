import { UseInterceptors,NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { plainToInstance } from "class-transformer";

interface classContructor {
    new (...args: any[]): {}
}

export function Serialize(dto: classContructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor (private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(map((data: any) =>{
            return plainToInstance(this.dto, data, {
                excludeExtraneousValues: true
            })
        }))
    }
}
