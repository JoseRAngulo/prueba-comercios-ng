export interface Business {
    id: number;
    name: string;
    date: Date;
    owner_name: string;
    address: string;
    types: number[];
}
export interface BusinessType {
    id: number;
    name: string;
}
export interface BusinessSubType {
    id: number;
    description: string;
    type: number;
}
