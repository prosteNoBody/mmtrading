import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import ItemsManager from './ItemsManager';
import ControlsManager from './ControlsManager';

const Container = styled.div`
  grid-area: offer-manager;
  display: grid;
  grid-template-columns: 1fr 8rem 1fr;
  grid-template-rows: auto 6rem 12rem;
  grid-template-areas:
  "inventory controls offer"
  "inventory controls form"
  "inventory preview preview";
  
  padding: 1rem;
  
  background: yellowgreen;
`;

type Item = {
    index:number;
    assetid: number;
    name: string;
    icon_url: string;
    rarity: string;
    color: string;
}
type Data = {
    inventory?:Item[];
    error?:string;
}
const OfferEditor: React.FC = () => {
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const [refresh,setRefresh] = useState(true);

    const [inventory,setInventory] = useState<Item[]>([]);
    const [inventoryItems,setInvetoryItems] = useState<Item[]>([]);
    const [offerItems,setOfferItems] = useState<Item[]>([]);

    useEffect(() => {
        setLoading(true);
        let unmounted = false;
        axios.get<Data>('http://localhost:3000/api/inventory')
            .then( ({data}) => {
                const {error,inventory} = data;
                if(!unmounted){
                    if(error){
                        setError(error);
                    }else{
                        setInventory(sortItems(inventory));
                        setInvetoryItems(sortItems(inventory));
                    }
                }
            })
            .catch(e=>{
                console.log(e);
                if(!unmounted){
                    setError("We are unable to contact server.");
                }
            })
            .finally(()=>{
                if(!unmounted){
                    setLoading(false);
                }
            });
        return () => {unmounted = true};
    },[refresh]);


    const sortItems = (array:Item[]) => {
        return array.sort((itemA,itemB)=>(itemA.index < itemB.index) ? 1 : -1);
    };
    const refreshItems = () => {
        setLoading(true);
        setOfferItems([]);
        setInvetoryItems([]);
        setInventory([]);

        setError("");
        setRefresh(!refresh);
    };
    const emptyInventory = () => {
        setInvetoryItems([]);
        setOfferItems([...inventory]);
    };
    const emptyOffer = () => {
        setOfferItems([]);
        setInvetoryItems([...inventory]);
    };

    const moveToOffer = (id:number) => {
        setOfferItems([...inventory.filter(item => item.assetid === id),...offerItems]);
        setInvetoryItems(inventoryItems.filter(item => item.assetid !== id));
    };
    const moveToInventory = (id:number) => {
        setInvetoryItems(sortItems([...inventory.filter(item => item.assetid === id),...inventoryItems]));
        setOfferItems(offerItems.filter(item => item.assetid !== id));
    };

    return (
        <Container>
            <ItemsManager isLoading={loading} error={error} items={inventoryItems} action={moveToOffer} gridSelector={'inventory'}/>
            <ItemsManager items={offerItems} action={moveToInventory} gridSelector={'offer'}/>
            <ControlsManager refreshAction={refreshItems} emptyAction={emptyOffer} fullAction={emptyInventory}/>
        </Container>
    );
};

export default OfferEditor;