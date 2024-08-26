import mongoose from "mongoose";
import { orderSchema } from "../interfaces/types";

const orderSchema = new mongoose.Schema<orderSchema>({
    orderID: {
        type: String || mongoose.SchemaTypes.UUID,
        require: true,
        unique: true
    },
    productList: {
        type: mongoose.SchemaTypes.Mixed,
        require: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    userID: {
        type: String || mongoose.SchemaTypes.ObjectId,
        require: true
    },
    fulfilledStatus: {
        type: Boolean,
        default: false
    }
})

const orderModel = mongoose.model('Orders', orderSchema)

export default orderModel

/* 

productList = [
    {
        productID: 'pi-01',
        price: 500,
        quantity: 1
    },
    {
        productID: 'pi-02',
        price: 100,
        quantity: 2
    },
    {
        productID: 'pi-02',
        price: 1000,
        quantity: 1
    }
]

*/