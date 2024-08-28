import { Router } from "express";
import { urls } from "../utils/enums";
import createOrder from "../controllers/orderCreate";

const router = Router()

router.post(urls.ORDER_CREATE, createOrder)

export default router