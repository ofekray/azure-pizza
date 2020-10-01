import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { extractClass, extractStore, extractParameter, handleError } from "../shared/Utils";
import { OrderToCreate } from "../objects/OrderToCreate";
import { OrderStatusRequest } from "../objects/OrderStatusRequest";
import { OrderToGet } from "../objects/OrderToGet";
import { AzureResponse } from "./types/AzureResponse";
import { OrdersDomain } from "../../business-logic/OrdersDomain";
import { AzureLogger } from "../../services/azure/AzureLogger";
import { DataService } from "../../services/interfaces/DataService";
import { AzureDataService } from "../../services/azure/AzureDataService";
import { OrderData } from "../../business-logic/objects/OrderData";
import { Status } from "../../types/Status";
import { Logger } from "../../services/interfaces/Logger";
import { runInAsyncScope } from "./utils/AzureExecutionScope";

// Services
const logger: Logger = new AzureLogger();
const dataService: DataService = new AzureDataService();

// Business Logic
const ordersDomain: OrdersDomain = new OrdersDomain(dataService, logger);

// Handlers
export const createOrder: AzureFunction = async (context: Context, req: HttpRequest) => {
    return runInAsyncScope(context, async() => {
        try {
            const store: string = extractStore(req.headers);
            const orderToCreate: OrderToCreate = await extractClass(OrderToCreate, req.body);
            const createdOrder: OrderToGet = OrderToGet.from(await ordersDomain.createOrder(orderToCreate.to(store)));
            context.res = new AzureResponse(createdOrder);
        }
        catch (err) {
            context.res = new AzureResponse(handleError(err, logger));
        }
    });
};

export const getOrderById: AzureFunction = async (context: Context, req: HttpRequest) => {
    return runInAsyncScope(context, async() => {
        try {
            const store: string = extractStore(req.headers);
            const id: string = extractParameter(req.params, "id")!;
            context.log(`Invoke getOrderById with id: ${id} and store: ${store}`);
            const order: OrderToGet = OrderToGet.from(await ordersDomain.getOrderById(id, store));
            context.res = new AzureResponse(order);
        }
        catch (err) {
            context.res = new AzureResponse(handleError(err, logger));
        }
    });
};

export const getOrders: AzureFunction = async (context: Context, req: HttpRequest) => {
    return runInAsyncScope(context, async() => {
        try {
            const store: string = extractStore(req.headers);
            const status: Status | undefined = extractParameter(req.query, "status", true) as Status | undefined;
            const ordersData: OrderData[] = await ordersDomain.getOrdersForStore(store, status);
            const ordersToGet: OrderToGet[] = ordersData.map(x => OrderToGet.from(x));
            context.res = new AzureResponse(ordersToGet);
        }
        catch (err) {
            context.res = new AzureResponse(handleError(err, logger));
        }
    });
};

export const updateOrderStatus: AzureFunction = async (context: Context, req: HttpRequest) => {
    return runInAsyncScope(context, async() => {
        try {
            const store: string = extractStore(req.headers);
            const id: string = extractParameter(req.params, "id")!;
            const orderStatusRequest: OrderStatusRequest = await extractClass(OrderStatusRequest, req.body);
            const updatedOrder: OrderToGet = OrderToGet.from(await ordersDomain.updateOrderStatus(id, orderStatusRequest.status, store));
            context.res = new AzureResponse(updatedOrder);
        }
        catch (err) {
            context.res = new AzureResponse(handleError(err, logger));
        }
    });
};

