import Styled from 'styled-components';
import { Popover } from 'antd';

const Content = Styled.div`  
  a, .span {
      display: block;
      color: #888;
      padding: 6px 12px;
      text-align: left;
      span {
        padding-right: 12px;
      }
  }
  a:hover {
    background: ${({ theme }) => theme['primary-color']}10;
    color: primary-color
  }
  
`;
const Title = Styled.p`
  text-align: ${({ theme }) => (theme.rtl ? 'right' : 'left')};
  margin: 0;
`;
const PopoverStyle = Styled(Popover)` 
  
`;
export { Content, PopoverStyle, Title };
