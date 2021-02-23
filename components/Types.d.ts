type OfferType = {
    id: string;
    is_mine: boolean;
    is_buyer: boolean;
    owner: {
        owner_id: string;
        name: string;
        avatar: string;
    };
    buyer_id: string;
    trade_id: string;
    price: number;
    items: Item[];
    date: string;
    status: number;
}

type ItemType = {
    index:number;
    assetid: number;
    name: string;
    icon_url: string;
    rarity: string;
    color: string;
    descriptions: Description[];
}

type DescriptionType = {
    type: string;
    value: string;
    color?: string;
}

type UserType = {
    avatar?:string;
    name?:string;
    credit?:number;
}

type OpenType = {
    open?:boolean;
}

export {OfferType ,ItemType, DescriptionType, UserType, OpenType};