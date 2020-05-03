import React from 'react';
import styled from 'styled-components';

import Item from './Item';
import LoadingIcon from './LoadingIcon';

type ContainerProps = {
    gridSelector:string;
}
const Container = styled.div`
  grid-area: ${(props: ContainerProps) => props.gridSelector};
  
  border-radius: 2rem 0 0 2rem;
  padding: 1rem;
  max-height: 100%;
  
  background: #222b3b;
  
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
  
  height: 100%;
  
  color: grey;
  
  text-align: center;
  font-size: 200%;
  user-select: none;
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
type Props = {
    isLoading?: boolean;
    error?: string;
    items:Item[];
    action:(id:number) => void;
    gridSelector: string;
}
const OfferEditor: React.FC<Props> = (props) => {
    const {items,action,gridSelector} = props;
    const isLoading = props.isLoading || false;
    const error = props.error || false;

    const createItem = (item:Item,action) => {
        return <Item key={item.assetid} assetid={item.assetid} imageUrl={item.icon_url} name={item.name} rarity={item.rarity} color={item.color} descriptions={item.descriptions} action={action}/>
    };

    const generateItems = () => {
        if(isLoading) return <InsideText>Loading... <LoadingIcon/></InsideText>;
        if(error) return <InsideText>{error}</InsideText>;
        if(!items[0]) return <InsideText>No items...</InsideText>;
        return <ItemsContainer>{items.map(item => createItem(item,action))}</ItemsContainer>
    };

    return (
        <Container gridSelector={gridSelector}>
            {generateItems()}
        </Container>
    );
};

export default OfferEditor;