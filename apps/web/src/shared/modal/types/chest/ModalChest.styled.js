import styled, {keyframes} from 'styled-components';

export const _chest = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _image = styled.div`
  min-width: 200px;
  width: 200px;
  min-height: 200px;
  height: 200px;
  margin-bottom: 16px;
  > img {
    min-width: 200px;
    width: 200px;
    min-height: 200px;
    height: 200px;
  }
`;

export const _confirm = styled.div``;
export const _gridContainer = styled(_chest)`
  margin-top: 10rem;
  height:100%;
  postion:relative;
  top: 0;
  backdrop-filter: blur(5px);
`;
export const _grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
  overflow-y: scroll;
  height:100%;
  width:100%;
  background:#1f2437;
  border-radius: 1rem 1rem 0 0 ;
  align-items: center;
  position: relative;
  top:0;
  padding: 1.25rem 1rem 1.25rem 1rem;
  margin-top: 1rem;
  margin-bottom: 4.5rem;
  @media (max-width: 768px) {
    height: 90%;
    width:97%;
  }
  @media (max-width: 356px) {
    height: 75%;
  }
`;

export const _gridLabel = styled.div`
  font-size: 2rem;
  font-weight: bold;
  font-family: 'Poppins';
  font-style: normal;
  color: #8692b1;
  letter-spacing: 0.2rem;
`;
const chestAnimation = keyframes`
  from {
    transform:scale(0.95);
    filter: drop-shadow(0 0 0.1rem #fbff91);
  }
  to{
    transform:scale(1.05);
    filter: drop-shadow(0 0 .2rem gold);
  }
`;
export const _gridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props?.color || '#1a1e2d'};
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0.5rem #000000;
  aspect-ratio: 1;
  min-width:20px;
  filter: brightness(0.8);
`;

export const _gridItemSelectable = styled(_gridItem)`
filter: brightness(1);
cursor:pointer;
transition: box-shadow 0.5s, transform 0.5s, filter 0.33s ease-in-out;
> img {
  transform: scale(.95,.95);
}
> div > div {
  border-radius: 8px 0 8px 0 ;
  background-color: #8692b1;
}
&:hover  {
  transform: scale(1.1,1.1);
  filter: drop-shadow(0 0 0.1rem white) brightness(1.2);
  > img {
    animation: ${chestAnimation} 2s cubic-bezier(.84,-0.86,.36,1.62) infinite alternate;
  }
  
}
`;
export const _gridCloseButton = styled.div`
display: flex;
position: absolute;
top: 2.5rem;
right: 2rem;
color: #cbcfe2;
background-color:#1f2437;
border-radius: 0.5rem 0.5rem 0 0 ;
width: 3rem;
height: 1.5rem;
align-items: center;
justify-content: center;
text-align: center;
margin: 0 auto;
transition: box-shadow 0.25s, transform 0.2s ease-in-out;
cursor: pointer;
&:hover {
  box-shadow:  0 0 .5rem white;
  transform: scale(1.05);
}
&:active {
  background-color: #1a1e2d;
}
`;