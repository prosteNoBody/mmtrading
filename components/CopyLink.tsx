import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
  grid-area: link;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem 0;
  padding: 0.3rem;
  
  background: var(--color-black);
  color: var(--color-immortal);
  
  user-select: all;
  cursor: pointer;
  z-index: 99;
`;

type Props = {
    link?: string;
}

const CopyLink: React.FC<Props> = (props) => {
    const {link} = props;

    return (
        <Container>
            {link}
        </Container>
    )
};

export default CopyLink;