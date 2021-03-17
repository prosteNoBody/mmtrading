import React from 'react';
import styled from 'styled-components';
import Link from "next/link";

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  
  padding: 2rem;
  padding-bottom: 1rem;
  
  box-shadow: inset 0 0 0.6rem var(--color-black);
  background: #E5E5E5;
  
  z-index: 1;
`;
const StepContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  text-align: center;
  
  padding: 1rem;
`;

type IconBorderProps = {
    themeColor: string;
};
const IconBorder = styled.div`
  padding: 1.5rem;
  border-radius: 50%;
  
  i {
    font-size: 2rem;
    color: var(--color-${(props: IconBorderProps) => props.themeColor});
  }
`;
const DashedIcon = styled(IconBorder)`
  border: 2px dashed var(--color-${(props: IconBorderProps) => props.themeColor});
  
  i {
    color: var(--color-black);
  }
`;
const Title = styled.h1`
  font-weight: normal;
  
  text-align: center;
`;
const ItemDescription = styled.div`
  margin-top: .5rem;
  margin-bottom: .5rem;
  
  width: 13rem;
  text-align: center;
`;

type Props = {
    themeColor: string;
}
const UserGuide: React.FC<Props> = (props) => {
    const {themeColor} = props;

    return (
        <Container>
            <Title>How to use MMTrading?</Title>
            <StepContainer>
                <ContainerItem>
                    <ContainerItem>
                        <DashedIcon themeColor={themeColor}><i aria-hidden className="fas fa-sign-in-alt"/></DashedIcon>
                    </ContainerItem>
                    <h3>1. Log-in with Steam</h3>
                    <ItemDescription>
                        Login trought your steam account and set trade link url in <Link href={"/settings"}><strong>Settings</strong></Link>.
                    </ItemDescription>
                </ContainerItem>
                <ContainerItem>
                    <ContainerItem>
                        <IconBorder themeColor={themeColor}><i aria-hidden className="fas fa-arrow-right"/></IconBorder>
                    </ContainerItem>
                </ContainerItem>
                <ContainerItem>
                    <ContainerItem>
                        <DashedIcon themeColor={themeColor}><i aria-hidden className="far fa-calendar-plus"/></DashedIcon>
                    </ContainerItem>
                    <h3>2. Create offer</h3>
                    <ItemDescription>
                        Select items and create new offer on <Link href={"/dashboard"}><strong>Dashboard</strong></Link>.
                    </ItemDescription>
                </ContainerItem>
                <ContainerItem>
                    <ContainerItem>
                        <IconBorder themeColor={themeColor}><i aria-hidden className="fas fa-arrow-right"/></IconBorder>
                    </ContainerItem>
                </ContainerItem>
                <ContainerItem>
                    <ContainerItem>
                        <DashedIcon themeColor={themeColor}><i aria-hidden className="fas fa-paper-plane"/></DashedIcon>
                    </ContainerItem>
                    <h3>3. Send link to buyer</h3>
                    <ItemDescription>
                        Copy link from offer page and send it to buyer. All offer can be found in <Link href={"/offers"}><strong>Offers</strong></Link>.
                    </ItemDescription>
                </ContainerItem>
            </StepContainer>
        </Container>
    );
};

export default UserGuide;