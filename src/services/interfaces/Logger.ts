export interface Logger {
    error(msg: string): void;
    error(msg: string, error: Error): void;
    error(error: Error): void;
    warn(msg: string): void;
    warn(msg: string, error: Error): void;
    warn(error: Error): void;
    info(msg: string): void;
    debug(msg: string): void;
}