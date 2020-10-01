import { MinLength, Matches, IsEmail, IsOptional } from "class-validator";
import { CustomerData } from "../../business-logic/objects/CustomerData";

export class Customer {
    @MinLength(1, {
        message: 'First name is required'
    })
    firstName!: string;

    @MinLength(1, {
        message: 'Last name is required'
    })
    lastName!: string;

    @Matches(/0\d{2}-\d{7}/)
    mobile!: string;

    @IsOptional()
    @IsEmail(undefined, {
        message: 'Email is not in correct format'
    })
    email!: string;

    to(): CustomerData {
        const result = new CustomerData();
        result.firstName = this.firstName;
        result.lastName = this.lastName;
        result.mobile = this.mobile;
        result.email = this.email ? this.email : "";
        return result;
    }

    static from(customerData: CustomerData): Customer {
        const result = new Customer();
        result.firstName = customerData.firstName;
        result.lastName = customerData.lastName;
        result.mobile = customerData.mobile;
        result.email = customerData.email;
        return result;
    }
}