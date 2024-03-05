const { default: styled } = require('styled-components');

const Container = ({ children }) => <Wrapper>{children}</Wrapper>;

export default Container;

const Wrapper = styled.div`
  width: 100%;
  padding: 0 48px;
`;
