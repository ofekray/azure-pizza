import { DataService } from "../services/interfaces/DataService";
import { OrderData } from "./objects/OrderData";
import { DomainError } from "./errors/DomainError";
import { HttpStatusCode } from "../types/HttpStatusCode";
import { Status } from "../types/Status";
import { Logger } from "../services/interfaces/Logger";

export class OrdersDomain {
    private dataService: DataService;
    private logger: Logger;

    constructor(dataService: DataService, logger: Logger) {
        this.dataService = dataService;
        this.logger = logger;
    }

    async createOrder(orderToCreate: OrderData): Promise<OrderData> {
        this.logger.info("in createOrder");
        if (await this.dataService.getActiveOrderByMobile(orderToCreate.customer.mobile)) {
            throw new DomainError(HttpStatusCode.BAD_REQUEST, "Customer already has an order in progress");
        }
        orderToCreate.status = Status.Preparation;
        return this.dataService.createOrder(orderToCreate);
    }

    async getOrderById(id: string, store: string): Promise<OrderData>  {
        this.logger.info("in getOrderById");
        const orderToGet: OrderData | undefined = await this.dataService.getOrderById(id, store);
        if (orderToGet) {
            return orderToGet;
        }
        else {
            throw new DomainError(HttpStatusCode.NOT_FOUND, "Order not found");
        }
    }

    async updateOrderStatus(id: string, status: Status, store: string): Promise<OrderData> {
        this.logger.info("in updateOrderStatus");
        const order: OrderData = await this.getOrderById(id, store);
        order.status = status;
        return this.dataService.updateOrder(order);
    }

    async getOrdersForStore(store: string, status?: Status) {
        this.logger.info("in getOrdersForStore");
        return this.dataService.getOrdersForStore(store, status);
    }
}