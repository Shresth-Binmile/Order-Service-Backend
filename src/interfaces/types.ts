import { Response } from "express"

export interface envTypes {
    PORT: string,
    MONGO_URI: string,
    RABBITMQ_URI: string,
    JWT_SECRET_KEY: string,
    REDIS_PORT: string
}

export interface responseTypes {
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    error?: string | {},
    data?: string | {}
}

export interface productListTypes {
    productID: string,
    price: number,
    quantity: number
}

export interface orderSchema {
    orderID: string,
    productList: productListTypes[],
    totalPrice: number,
    userID: string,
    fulfilledStatus?: boolean
}

export interface orderQueueMsgTypes {
    userID: string,
    orderID: string
}

export interface notificationMsgTypes {
    userID: string,
    message: string
}