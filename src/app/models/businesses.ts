export interface Business {
    id: number;
    name: string;
    date: Date;
    owner_name: string;
    address: string;
    types: number[];
}

export interface BusinessSubType {
    id: string;
    description: string;
    type: number;
}
