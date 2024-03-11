/*Libs*/
import styled from 'styled-components';

/*User Libs*/
import { ConnectForm } from '@/lib/react-hook-form';

const Input = ({ name, ...rest }) => {
  return <ConnectForm>{({ register }) => <Wrapper {...register(name)} {...rest}></Wrapper>}</ConnectForm>;
};
export default Input;

const Wrapper = styled.input`
  width: 100%;
  display: block;
  padding: 0 12px;
  height: 38px;
  font-size: 1em;
  border: none;
  outline: 1px solid var(--thirdColor);
  background-color: inherit;
  border-radius: var(--borderRadius);
  &:hover {
    outline: 1px solid var(--textColor);
  }
  &:focus {
    outline: 2px solid var(--textColor);
  }
`;
