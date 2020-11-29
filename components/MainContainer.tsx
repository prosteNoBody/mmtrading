import styled from "styled-components";

const Container = styled.div`
  display:grid;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  
  grid-template-columns: 100vw;
  grid-template-rows: 5.5rem calc(100vh - 5.5rem);
  grid-template-areas:
  "navbar"
  "main-content";
`;

export default Container;