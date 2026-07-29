import type { NextFunction, Request, Response } from "express";
import CustomError from "./custom.error";

const globalErrorHandler = (
    err: CustomError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode: number = err instanceof CustomError ? err.statusCode : 500;
    console.error(err);
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default globalErrorHandler;