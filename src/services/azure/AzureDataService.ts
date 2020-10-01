import { DataService } from "../interfaces/DataService";
import { CosmosClient, Container, SqlParameter } from "@azure/cosmos";
import { OrderData } from "../../business-logic/objects/OrderData";
import { Status } from "../../types/Status";

export class AzureDataService implements DataService {
    client: CosmosClient;
    ordersContainer: Container;

    constructor() {
        const endpoint = `https://${process.env.DB_ACCOUNT_NAME}.documents.azure.com:443/`; 
        const key = process.env.DB_ACCOUNT_KEY;
        this.client = new CosmosClient({ endpoint, key });
        this.ordersContainer = this.client.database(process.env.DB_NAME!).container(process.env.ORDERS_CONTAINER!);
    }

    async createOrder(order: OrderData): Promise<OrderData> {
        const response = await this.ordersContainer.items.create({ ...order, mobile: order.customer.mobile });
        return response.resource as OrderData;
    }

    async updateOrder(order: OrderData): Promise<OrderData> {
        const response = await this.ordersContainer.items.upsert<OrderData>({ ...order, mobile: order.customer.mobile } as OrderData);
        return response.resource as OrderData;
    }

    async getOrderById(id: string, store: string): Promise<OrderData | undefined> {
        const item = this.ordersContainer.item(id, store);
        const response = await item.read<OrderData>();
        return response.resource;
    }

    async getOrdersForStore(store: string, status?: Status): Promise<OrderData[]> {
        let query: string = "SELECT * FROM root where root.store = @store";
        let parameters: SqlParameter[] = [
            {
                name: "@store",
                value: store
            }
        ];

        if (status) {
            query += " and root.status = @status";
            parameters.push({
                name: "@status",
                value: status
            });
        }

        const response = await this.ordersContainer.items.query<OrderData>({query, parameters}).fetchAll();
        return response.resources ? response.resources : [];
    }

    async getActiveOrderByMobile(mobile: string): Promise<OrderData | undefined> {
        let query: string = "SELECT * FROM root where root.mobile = @mobile";
        let parameters: SqlParameter[] = [
            {
                name: "@mobile",
                value: mobile
            }
        ];
        const response = await this.ordersContainer.items.query<OrderData>({query, parameters}).fetchAll();
        return (response.resources && response.resources.length > 0) ? response.resources[0] : undefined;
    } 
}