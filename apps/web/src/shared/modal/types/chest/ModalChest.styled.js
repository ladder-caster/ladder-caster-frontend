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

  grid-gap: 0.5rem;
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
    filter: drop-shadow(0 0 0.1rem gold);
  }
  to{
    transform:scale(1.05);
    filter: drop-shadow(0 0 .3rem gold);
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
  min-width:81px;
  
  @media (max-width: 400px) {
    min-width:30px;
  }
`;

export const _gridItemSelectable = styled(_gridItem)`
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
  filter: drop-shadow(0 0 .1rem white);
  > img {
    animation: ${chestAnimation} 1s ease-in-out infinite alternate;
  }
}
`;
export const _gridCloseButton = styled.div`
display: flex;
position: absolute;
top: 2rem;
right: 2rem;
color: #cbcfe2;
background-color:#1f2437;
border-radius: 0.5rem 0.5rem 0 0 ;
width: 3rem;
height: 2rem;
align-items: center;
justify-content: center;
text-align: center;
margin: 0 auto;
transition: box-shadow 0.25s, transform 0.2s ease-in-out;
&:hover {
  box-shadow:  0 0 .5rem white;
  transform: scale(1.05);
}
`;