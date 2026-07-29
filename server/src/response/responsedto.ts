class ResponseDto {
    statusCode: number
    message: string
    body: any

    constructor(statusCode: number, message: string, body: any) {
        this.statusCode = statusCode
        this.message = message
        this.body = body
    }
}

export default ResponseDto;