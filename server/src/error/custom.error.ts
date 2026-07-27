class CustomError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational: boolean = true, stack: string = "") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational; // distinguishes expected errors from bugs

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default CustomError;