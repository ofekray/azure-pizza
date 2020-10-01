import { Logger } from "../interfaces/Logger"
import { getRequestContext } from "../../handlers/azure/utils/AzureExecutionScope";
import { Context } from "@azure/functions";

export class AzureLogger implements Logger {

    error(msgOrError: string | Error, maybeError?: Error){
        this.logMsg("error", msgOrError, maybeError);
    }

    warn(msgOrError: string | Error, maybeError?: Error){
        this.logMsg("warn", msgOrError, maybeError);
    }

    info(msg: string) {
        this.logMsg("info", msg);
    }

    debug(msg: string) {
        this.logMsg("verbose", msg);
    }

    private logMsg(logLevel: "error" | "warn" | "info" | "verbose", msgOrError: string | Error, maybeError?: Error) {
        const context: Context | undefined = getRequestContext();
        if (context) {
            if (msgOrError instanceof Error) {
                context.log[logLevel](msgOrError.stack);
            }
            else {
                if (maybeError) {
                    context.log[logLevel](msgOrError, maybeError.stack);
                } else {
                    context.log[logLevel](msgOrError);
                }
            }
        }
    }
}