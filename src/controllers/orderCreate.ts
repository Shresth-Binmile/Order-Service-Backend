import { Request, Response } from "express";
import { response } from "../common/responses";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from 'uuid';
import messages from "../utils/messages";
import { notificationMsgTypes, orderQueueMsgTypes, orderSchema } from "../interfaces/types";
import orderModel from "../models/ordersModel";
import connectRabbitMQ from "../rabbitmq/sender";
import { bindingKeys, notifications } from "../utils/enums";

async function createOrder (req: Request, res: Response) {
    try {
        // check if the user is logged in or not
        // if not throw authentication error 
        // else proceed to next steps...
        
        // first step would be to get order details from req.body
        const {productList, totalPrice, userID} = req.body

        // create a unique order id for the given order request...
        const UUID = uuidv4()

        // create a new order & then save it to DB.
        const newOrder = new orderModel({
            orderID: UUID,
            productList: productList,
            totalPrice: totalPrice,
            userID: userID,
        })

        await newOrder.save()

        // now publish an event with event details to RMQ Server
        // notify user about each event that is published on the Server
        const queueMsg:orderQueueMsgTypes = {
            userID,
            orderID: UUID
        }
        const notificationMsg:notificationMsgTypes = {
            userID,
            message: notifications.ORDER_CREATED
        }

        connectRabbitMQ(queueMsg, bindingKeys.ORDER_CREATED, notificationMsg)

        response({res, statusCode:StatusCodes.CREATED, success: true, message: messages.ORDER_CREATED})
    } catch (error) {
        response({res, statusCode:StatusCodes.SERVICE_UNAVAILABLE, success:false, message:messages.NOT_FULFILLED, error:{error}})
    }
}

export default createOrder