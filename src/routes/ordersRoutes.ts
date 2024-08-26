import { Router } from "express";
import { urls } from "../utils/enums";
import createOrder from "../controllers/orderCreate";
import updateOrder from "../controllers/orderUpdate";

const router = Router()

router.post(urls.ORDER_CREATE, createOrder)

router.post(urls.ORDER_UPDATE, updateOrder)

export default router