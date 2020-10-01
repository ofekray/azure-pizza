import { HttpStatusCode } from "../../types/HttpStatusCode";

export class ApiResponse<T> {
    data: T;
    status: HttpStatusCode;
    message?: string;

    constructor(data: T, status: HttpStatusCode = HttpStatusCode.OK, message?: string) {
        this.data = data;
        this.status = status;
        this.message = message;
    }
}