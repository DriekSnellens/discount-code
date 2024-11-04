export enum DiscountType {
    PRICE = 1,
    PERCENTAGE = 2,
}

export interface Discount {
    id: number,
    title : string,
    code : string,
    description : string,
    discount_type_id : number,
    discount_value : number,
    valid_from: string,
    valid_until ?: string,
    usage_limit : boolean,
    usage_count ?: number
}