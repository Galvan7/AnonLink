import { Message } from "@/model/User"
import { boolean, string, success } from "zod"

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?: boolean
    messages?: Array<Message>
}