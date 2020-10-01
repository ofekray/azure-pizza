import { HttpStatusCode } from "../../types/HttpStatusCode";

export class DomainError extends Error {
    constructor (public code: HttpStatusCode, public message: string) {
        super(message);
    }
}