import { StatusCode } from "./statusCode-model";

export class ClientError {
    public status: StatusCode;
    public message: string;

    public constructor(status: StatusCode, message: string) {
        this.status = status;
        this.message = message;
    }
    
}