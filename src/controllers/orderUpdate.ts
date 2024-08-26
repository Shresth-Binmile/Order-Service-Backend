import { Request, Response } from "express";
import { response } from "../common/responses";
import { StatusCodes } from "http-status-codes";
import messages from "../utils/messages";
import orderModel from "../models/ordersModel";
import { notificationMsgTypes, orderQueueMsgTypes } from "../interfaces/types";
import { bindingKeys, notifications } from "../utils/enums";
import connectRabbitMQ from "../rabbitmq/sender";

async function updateOrder (req:Request, res:Response) {
    try {
        // check if the user is logged in or not
        // if not throw authentication error 
        // else proceed to next steps...

        // first step would be to get order details from req.body
        const {productList, totalPrice, userID, orderID} = req.body

        // now find the order in the DB using orderID
        // IF order is not in DB, THEN throw error
        // ELSE update the order & save it to DB...

        const orderDetailsFetchedFromDB = await orderModel.findOne({orderID})

        if(!orderDetailsFetchedFromDB){
            return response({res, statusCode:StatusCodes.NOT_FOUND, success:false, message:messages.ORDER_NOT_IN_DB})
        }
        // console.log(orderDetailsFetchedFromDB)
        await orderModel.updateOne({orderID}, {$set: {
            productList,
            totalPrice,            
        }})

        // now publish an event with event details to RMQ Server
        // notify user about each event that is published on the Server
        const queueMsg:orderQueueMsgTypes = {
            userID,
            orderID
        }
        const notificationMsg:notificationMsgTypes = {
            userID,
            message: notifications.ORDER_UPDATED
        }

        connectRabbitMQ(queueMsg, bindingKeys.ORDER_UPDATED, notificationMsg)

        response({res, statusCode:StatusCodes.OK, success:true, message:messages.ORDER_UPDATE_SUCCESS})
    } catch (error) {
        response({res, statusCode:StatusCodes.BAD_REQUEST, success:false, message:messages.ORDER_UPDATE_FAILED, error:{error}})
    }
}

export default updateOrder