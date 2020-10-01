import { Type } from "class-transformer";
import { ValidateNested, IsIn, IsArray, IsInstance } from "class-validator";
import { Customer } from "./Customer";
import { Topping } from "../../types/Topping";
import { Address } from "./Address";
import { OrderData } from "../../business-logic/objects/OrderData";

export class OrderToCreate {
    @IsInstance(Customer)
    @ValidateNested()
    @Type(() => Customer)
    customer!: Customer;

    @IsInstance(Address)
    @ValidateNested()
    @Type(() => Address)
    address!: Address;

    @IsArray()
    @IsIn(Object.values(Topping), {
        each: true,
        message: "Toppings are not valid"
    })
    toppings!: Topping[];

    to(store: string): OrderData {
        const result: OrderData = new OrderData;
        result.customer = this.customer.to();
        result.address = this.address.to();
        result.toppings = this.toppings;
        result.store = store;
        return result;
    }
}