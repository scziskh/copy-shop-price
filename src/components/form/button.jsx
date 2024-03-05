import { styled } from 'styled-components';

const Button = (props) => {
  return (
    <Wrapper name={props.name} onClick={props.handler} $bgColor={props.bgColor} type={props.type} disabled={props.disabled}>
      {props.label}
    </Wrapper>
  );
};

export default Button;

const Wrapper = styled.button`
  display: flex;
  height: 38px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border: none;
  background: ${({ $bgColor }) => $bgColor ?? 'var(--secondaryColor)'};
  color: white;
  cursor: pointer;
  border-radius: var(--borderRadius);
  font-weight: 600;
  transition: filter var(--transitionDuration);
  &:disabled {
    background: #eee;
    color: var(--thirdColor);
    cursor: progress;
    &:hover {
      filter: none;
    }
  }
  &:hover {
    filter: var(--hoverBrightness);
  }
  & > div {
    margin-right: 24px;
  }
`;
