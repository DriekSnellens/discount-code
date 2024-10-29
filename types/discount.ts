import type { DiscountType } from "./discount-type"

export interface IDiscount {
    title : string,
    code : string,
    description : string,
    discountType : DiscountType,
    discountValue : number,
    validFrom: Date,
    validUntil ?: Date,
    hasUsageLimit : boolean,
    usageLimitCount ?: number
}