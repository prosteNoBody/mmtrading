import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {useQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';

import ItemsManager from './ItemsManager';
import ControlsManager from './ControlsManager';
import OfferSubmitter from './OfferSubmitter';

const Container = styled.div`
  grid-area: offer-manager;
  display: grid;
  grid-template-columns: 1fr 8rem 1fr;
  grid-template-rows: 3fr 20rem;
  grid-template-areas:
  "inventory controls offer"
  "inventory preview preview";
  
  padding: 2rem;
  
  background: rgb(247,247,247);
  background: radial-gradient(circle, rgba(247,247,247,1) 0%, rgba(230,230,230,1) 100%);
`;
type Description = {
    type: string;
    value: string;
    color?: string;
}

type Item = {
    index:number;
    assetid: number;
    name: string;
    icon_url: string;
    rarity: string;
    color: string;
    descriptions: Description[];
}

type RespondData = {
    inventory?: {
        error?: string,
        items: Item[]
    };
}

type Props = {
    persona: string;
    avatar: string;
}
const ITEM_REQUEST = gql`
        {
            inventory{
                error
                items{
                    index
                    assetid
                    name
                    icon_url
                    rarity
                    color
                    descriptions{
                        type
                        value
                    }
                }
            }
        }`;
const OfferEditor: React.FC<Props> = (props) => {
    const {persona,avatar} = props;
    const [errorMessage,setErrorMessage] = useState("");

    const [inventory,setInventory] = useState<Item[]>([]);
    const [inventoryItems,setInventoryItems] = useState<Item[]>([]);
    const [offerItems,setOfferItems] = useState<Item[]>([]);

    const {loading, error, data, refetch} = useQuery<RespondData>(ITEM_REQUEST,{fetchPolicy: 'cache-and-network'});

    useEffect(() => {
        if(error)
            setErrorMessage("We were unable to get inventory data from server.");
        if(data){
            // if(data.error)
            //     setErrorMessage(data.error);
            if(data.inventory.error)
                setErrorMessage(data.inventory.error);
            if(data.inventory.items){
                setInventory(data.inventory.items);
                setInventoryItems(data.inventory.items);
                setOfferItems([]);
            }
        }
    },[error,data]);

    const sortItems = (array:Item[]) => {
        return array.sort((itemA,itemB)=>(itemA.index < itemB.index) ? 1 : -1);
    };
    const refreshItems = () => {
        refetch().then();
    };
    const emptyInventory = () => {
        setInventoryItems([]);
        setOfferItems([...inventory]);
    };
    const emptyOffer = () => {
        setOfferItems([]);
        setInventoryItems([...inventory]);
    };

    const moveToOffer = (id:number) => {
        setOfferItems([...inventory.filter(item => item.assetid === id),...offerItems]);
        setInventoryItems(inventoryItems.filter(item => item.assetid !== id));
    };
    const moveToInventory = (id:number) => {
        setInventoryItems(sortItems([...inventory.filter(item => item.assetid === id),...inventoryItems]));
        setOfferItems(offerItems.filter(item => item.assetid !== id));
    };

    return (
        <Container>
            <ItemsManager isLoading={loading} error={errorMessage} items={inventoryItems} action={moveToOffer} gridSelector={'inventory'} createDescriptions={true}/>
            <ItemsManager items={offerItems} action={moveToInventory} gridSelector={'offer'} createDescriptions={true}/>
            <ControlsManager refreshAction={refreshItems} emptyAction={emptyOffer} fullAction={emptyInventory}/>
            <OfferSubmitter items={offerItems} persona={persona} avatar={avatar}/>
        </Container>
    );
};

export default OfferEditor;