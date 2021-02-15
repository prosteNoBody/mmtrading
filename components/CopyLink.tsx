import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
  grid-area: link;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem 0;
  padding: 0.3rem;
  
  background: var(--color-immortal);
  color: var(--color-white);
  
  user-select: all;
  cursor: pointer;
  z-index: 99;
`;

type Props = {
    offerId?: string;
}

const CopyLink: React.FC<Props> = (props) => {
    const {offerId} = props;
    const MMTRADING_OFFER_URL = window.location + "/offer/";

    return (
        <Container>
            {MMTRADING_OFFER_URL + offerId}
        </Container>
    )
};

export default CopyLink;