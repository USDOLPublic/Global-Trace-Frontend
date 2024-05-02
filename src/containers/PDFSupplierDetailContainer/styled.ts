import styled, { injectGlobal } from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 794px;
  margin: 0 auto;
`;

injectGlobal`
  body {
    overflow: inherit;
  }`;

export const Container = styled.div`
  padding: 20px;
  position: relative;
`;
