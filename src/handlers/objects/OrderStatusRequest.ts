import { IsIn } from "class-validator";
import { Status } from "../../types/Status";

export class OrderStatusRequest {
    @IsIn(Object.values(Status), {
        message: "Status is not valid"
    })
    status!: Status;
}