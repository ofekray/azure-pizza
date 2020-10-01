import { HttpStatusCode } from "../../../types/HttpStatusCode";
import { ApiResponse } from "../../shared/ApiResonse";
import StatusDescription from "../../shared/StatusDescription";

export class AzureResponse<T> {
    status: HttpStatusCode;
    body: { data: T, status: string, message?: string };
    headers: { [name: string]: string };

    constructor(data: ApiResponse<T> | T) {
        const apiResponse: ApiResponse<T> = data instanceof ApiResponse ? data : new ApiResponse(data);
        this.status = apiResponse.status;
        this.headers = { "Content-Type": "application/json" };
        this.body = {
            data: apiResponse.data,
            status: StatusDescription[apiResponse.status],
            message: apiResponse.message
        };
    }
}