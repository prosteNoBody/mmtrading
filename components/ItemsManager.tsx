import React from 'react';
import styled from 'styled-components';

import {ItemType} from "./Types";

import Item from './Item';
import LoadingIcon from './LoadingIcon';

type ContainerProps = {
    gridSelector:string;
}
const Container = styled.div`
  grid-area: ${(props: ContainerProps) => props.gridSelector};
  
  display: flex;
  justify-content: center;
  
  flex: 1;
  
  padding: 2rem;
  
  background: rgb(28,28,28);
  background: radial-gradient(circle, rgba(45,45,45,1) 0%, rgba(28,28,28,1) 100%);
  
  filter: drop-shadow(0 0 .75rem var(--color-gray));
  overflow-y: scroll;
  overflow-x: hidden;
  
  ::-webkit-scrollbar {
      width: 10px;
  }
  ::-webkit-scrollbar-track {
      background: #f1f1f1; 
  }
  ::-webkit-scrollbar-thumb {
      background: #888; 
  }
  ::-webkit-scrollbar-thumb:hover {
      background: #555; 
  }
`;

const ItemsContainer = styled.div`
  justify-self: auto;
  align-self: auto;

  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
`;

const InsideText = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  color: var(--color-gray);
  
  text-align: center;
  font-size: 200%;
  user-select: none;
`;

const BottomPadding = styled.div`
  width: 100%;
  
  padding-bottom: 2rem;
`;

type Props = {
    isLoading?: boolean;
    error?: string;
    items:ItemType[];
    action:(id:number) => void;
    gridSelector: string;
    createDescriptions: boolean;
    itemSize?: string;
    emptyInventoryMessage?: string;
}
const ItemsManager: React.FC<Props> = (props) => {
    const {items,action,gridSelector, createDescriptions, itemSize, emptyInventoryMessage} = props;
    const isLoading = props.isLoading || false;
    const error = props.error || false;

    const createItem = (item:ItemType,action) => {
        return <Item createDescription={createDescriptions} key={item.assetid} assetid={item.assetid} imageUrl={item.icon_url} name={item.name} rarity={item.rarity} color={item.color} descriptions={item.descriptions} action={action} itemSize={itemSize}/>
    };

    const generateItems = () => {
        if(isLoading) return <InsideText>Loading... <LoadingIcon/></InsideText>;
        else if(error) return <InsideText>{error}</InsideText>;
        else if(!items[0]) return <InsideText>{emptyInventoryMessage || 'No items...'}</InsideText>;
        return <ItemsContainer>{items.map((item) => createItem(item,action))}<BottomPadding/></ItemsContainer>
    };

    return (
        <Container gridSelector={gridSelector}>
            {generateItems()}
        </Container>
    );
};

export default ItemsManager;