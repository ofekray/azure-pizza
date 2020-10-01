import { City } from "../../types/City";
import { IsIn, MinLength } from "class-validator";
import { AddressData } from "../../business-logic/objects/AddressData";

export class Address {
    @IsIn(Object.values(City), {
        message: "City is not supported"
    })
    city!: City;

    @MinLength(1, {
        message: 'Street is required'
    })
    street!: string;

    to(): AddressData {
        const result = new AddressData();
        result.city = this.city;
        result.street = this.street;
        return result;
    }

    static from(addressData: AddressData): Address {
        const result = new Address();
        result.city = addressData.city;
        result.street = addressData.street;
        return result;
    }
}