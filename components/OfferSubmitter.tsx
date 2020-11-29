import React, {useState} from 'react';
import styled from 'styled-components'

import ItemManager from './ItemsManager';
import PriceEditor from './PriceEditor';

const Container = styled.div`
  grid-area: preview;

  margin: 1.5rem 0 0 1.5rem;
  padding: .7rem;
  
  background: var(--color-arcana);
`;

const SemiContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 15rem;
  grid-template-rows: 2fr 3fr 5rem;
  grid-template-areas:
  "inventory profile"
  "inventory price"
  "inventory submit";

  width: 100%;
  height: 100%;
  
  padding: .5rem;
  
  border: 2px dashed var(--color-white);
`;
const ProfileInfoWrapper = styled.div`
  position: relative;
  grid-area: profile;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem;
  padding-bottom: 0.3rem;
  
  color: var(--color-white);
  
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  
  word-break: break-word;
  
  &:after{
    content: "";
    position: absolute;
    bottom: -10px;
    height: 2px;
    width: 60%;
    
    background: grey;
  }
`;
const ProfileImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin-left: 1rem;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  
  border: 2px solid var(--color-rare);
  
  filter: drop-shadow(0 0 .4rem var(--color-rare));
  overflow: hidden;
`;
const SubmitButton = styled.div`
  grid-area: submit;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem;
  padding: .5rem;
  border-radius: 1rem;
  
  background: grey;
  color: var(--color-white);
  box-shadow:inset 0 0 10px #AAAAAA;
  
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  
  user-select: none;
  cursor: pointer;
`;

type Item = {
    index:number;
    assetid: number;
    name: string;
    icon_url: string;
    rarity: string;
    color: string;
    descriptions: {
        type: string;
        value: string;
        color?: string;
    }[];
}

type Props = {
    avatar?:string;
    persona?:string;
    items: Item[];
    link?: string;
}
const OfferSubmitter: React.FC<Props> = (props) => {
    const {items,avatar,persona} = props;
    const [price,setPrice] = useState(0);

    const editPrice = (event) => {
        if(event.target.value !== "" && !Number(event.target.value))
            return;
        setPrice(Number(event.target.value));
    };

    const generateProfileInfo = (avatar, persona) => {
          if(!avatar || !persona){
              return (
                  <ProfileInfoWrapper>Login to submit offer</ProfileInfoWrapper>
              );
          }
          return (
              <ProfileInfoWrapper>{persona} <ProfileImgWrapper><img src={avatar}/></ProfileImgWrapper></ProfileInfoWrapper>
          )
    };

    return (
        <Container>
            <SemiContainer>
                {generateProfileInfo(avatar,persona)}
                <ItemManager items={items} action={()=>{}} gridSelector={"inventory"} createDescriptions={false} itemSize={"80px"}/>
                <PriceEditor price={price ? price : ""} editPrice={editPrice}/>
                <SubmitButton>SUBMIT</SubmitButton>
            </SemiContainer>
        </Container>
    )
};

export default OfferSubmitter;