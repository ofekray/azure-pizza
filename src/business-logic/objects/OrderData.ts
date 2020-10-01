import { CustomerData } from "./CustomerData";
import { Topping } from "../../types/Topping";
import { Status } from "../../types/Status";
import { AddressData } from "./AddressData";

export class OrderData {
    store!: string;
    id!: string;
    customer!: CustomerData;
    address!: AddressData;
    toppings!: Topping[];
    status!: Status;
}