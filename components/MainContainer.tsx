import styled from "styled-components";

const MainContainer = styled.div`
  display:grid;
  min-width: 1100px;
  min-height: 675px;
  
  grid-template-columns: 1fr;
  grid-template-rows: 5.5rem calc(100vh - 5.5rem);
  grid-template-areas:
  "navbar"
  "main-content";
  
  @media (max-width: 1100px) {
    height: 98vh;
      grid-template-rows: 5.5rem calc(98vh - 5.5rem);
  }
`;

export default MainContainer;