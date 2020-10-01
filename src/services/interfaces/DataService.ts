import { OrderData } from "../../business-logic/objects/OrderData";
import { Status } from "../../types/Status";

export interface DataService {
    createOrder(order: OrderData): Promise<OrderData>;
    updateOrder(order: OrderData): Promise<OrderData>;
    getOrderById(id: string, store: string): Promise<OrderData | undefined>;
    getActiveOrderByMobile(mobile: string): Promise<OrderData | undefined>;
    getOrdersForStore(store: string, status?: Status): Promise<OrderData[]>;
}