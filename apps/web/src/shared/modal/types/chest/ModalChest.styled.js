import styled, { keyframes } from 'styled-components';

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
export const _grid_container = styled(_chest)`
  margin-top: 8px;
  height: 100%;
  top: 0;
  backdrop-filter: blur(5px);
  padding-top: 72px;
`;
export const _grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(
    ${(props) => (props.rows > 4 ? props.rows : 4)},
    1fr
  );
  grid-gap: 8px;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
  align-items: center;
  position: relative;
  top: 0;
  padding: 16px 16px 16px 16px;
`;

export const _grid_label = styled.div`
  font-size: 32px;
  font-weight: bold;
  font-family: 'Poppins';
  font-style: normal;
  color: ${({ theme }) => theme.text.base};
  letter-spacing: 4px;
`;
const _chest_animation = keyframes`
  from {
    transform:scale(1.08);
    filter: drop-shadow(0 0 0.1rem ${({ theme }) =>
      theme.text.alert}) brightness(1.08);
  }
  to{
    transform:scale(1.2);
    filter: drop-shadow(0 0 .2rem gold) brightness(1.2);;
    z-index: 999;
  }
`;
export const _grid_item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-width: 16px;
  filter: brightness(1.05);
`;

export const _grid_item_selectable = styled(_grid_item)`
  filter: brightness(1.08);
  cursor: pointer;
  transition: box-shadow 0.5s, transform 0.5s, filter 0.33s ease-in-out;
  > img {
    transform: scale(1.1);
  }
  > div > div {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.item['legendary']};
    box-shadow: ${({ theme }) => theme.shadow['popover']};
  }
  &:hover,
  &:focus {
    > img {
      transform: scale(1.2, 1.2);

      animation: ${_chest_animation} 2s cubic-bezier(0.84, -0.86, 0.36, 1.62)
        infinite alternate;
    }
  }
`;
export const _grid_close_button = styled.div`
  position: relative;
  display: flex;
  color: ${({ theme }) => theme.text.active};
  background-color: ${({ theme }) => theme.background.lowest};
  border-radius: 16px 16px 0 0;
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  transition: box-shadow 0.25s ease-in-out;
  cursor: pointer;
  &:hover,
  &:focus {
    box-shadow: ${({ theme }) => theme.shadow['frost']};
    background: ${({ theme }) => theme.background['button_low']};
  }
  &:active {
    background-color: #1a1e2d;
  }
`;
export const _double_height_clickable = styled.div`
  @media (max-width: 400px) {
    cursor: pointer;
    width: 100%;
    height: 200%;
    position: absolute;
  }
`;
