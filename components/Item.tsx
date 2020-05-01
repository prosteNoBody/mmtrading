import React from 'react';
import styled from 'styled-components'

type ContainerProps = {
    rarity:string;
}
const Rarity = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  
  padding: 0.2rem;
  width: 100%;
  
  background: rgba(0,0,0,0.8);
  color: #${(props: ContainerProps) => props.rarity};
  
  text-align: center;
  
  user-select: none;
`;
const Container = styled.div`
  position: relative;
  
  margin: 0.3rem;
  border-radius: 1rem;
  height: max-content;
  
  border: 2px solid #${(props:ContainerProps) => props.rarity};
  
  cursor: pointer;
  overflow: hidden;
    
  &:hover ${Rarity}{
    display: block;
  }
`;

type Props = {
    assetid: number;
    image: string;
    name: string;
    rarity: string;
    color: string;
    action:(id:number) => void;
}
const Item: React.FC<Props> = (props) => {
    const {assetid,name,rarity,image,color,action} = props;

    return (
        <Container rarity={color} onClick={() => action(assetid)}>
            <img width="120px" alt={'item'} src={image}/>
            <Rarity rarity={color}>{rarity}</Rarity>
        </Container>
    )
};

export default Item;