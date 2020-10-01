
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { DomainError } from "../../business-logic/errors/DomainError";
import { HttpStatusCode } from "../../types/HttpStatusCode";
import { ApiResponse } from "./ApiResonse";
import { Logger } from "../../services/interfaces/Logger";

export const extractStore = (headers: { [header: string]: string | undefined | null } | undefined | null) => {
    if (headers && (headers["STORE_ID"] || headers["store_id"])) {
        return headers["STORE_ID"]! || headers["store_id"]!;
    }
    throw new DomainError(HttpStatusCode.BAD_REQUEST, "STORE_ID request header is missing");
}

export const extractParameter = (pathOrQueryParams: { [key: string]: string | undefined | null } | undefined | null, key: string, optional: boolean = false) => {
    if (pathOrQueryParams && pathOrQueryParams[key]) {
        return pathOrQueryParams[key]!;
    }
    if (optional) {
        return undefined;
    }
    throw new DomainError(HttpStatusCode.BAD_REQUEST, `${key} request parameter is missing`);
}

export const extractClass = async <T>(ctr: new() => T, body: any): Promise<T> => {
    let jsonObj: any;

    if (!body) {
        throw new DomainError(HttpStatusCode.BAD_REQUEST, "Request body is empty");
    }

    try {
        jsonObj = typeof body === 'string' ? JSON.parse(body) : body;
    }
    catch(err) {
        throw new DomainError(HttpStatusCode.BAD_REQUEST, "Request body is not a valid json");
    }

    const classToCreate: T = plainToClass(ctr, jsonObj);
    return validate(classToCreate).then(errors => {
        if (errors.length > 0) {
            throw new DomainError(HttpStatusCode.BAD_REQUEST, "Request body is in wrong format: " + JSON.stringify(errors));
        }
        else {
            return classToCreate;
        }
    });
};

export const handleError = (error: any, logger: Logger) => {
    if (error instanceof DomainError) {
        return new ApiResponse(undefined, error.code, error.message);
    }
    else {
        logger.error("API got Internal Server Error", error); 
        return new ApiResponse(undefined, HttpStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
    }
}