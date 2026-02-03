import React from 'react';
import PropTypes from 'prop-types';
// import './style.css';
import FeatherIcon from 'feather-icons-react';
import { Content, PopoverStyle, Title } from './style';
import Link from 'next/link';

const Popover = props => {
  const { content, placement, title, action, children } = props;
  const content1 = <Content>{content}</Content>;

  return (
    <PopoverStyle placement={placement} title={title && <Title>{title}</Title>} content={content1} trigger={action}>
      {children}
    </PopoverStyle>
  );
};

const content = (
  <>
    <Link href="#">
      <FeatherIcon size={16} icon="check" />
      <span>Btn Dropdown one</span>
    </Link>
    <Link href="#">
      <FeatherIcon size={16} icon="check" />
      <span>Btn Dropdown two</span>
    </Link>
    <Link href="#">
      <FeatherIcon size={16} icon="check" />
      <span>Btn Dropdown three</span>
    </Link>
  </>
);

Popover.defaultProps = {
  action: 'hover',
  placement: 'bottomCenter',
  content,
};

Popover.propTypes = {
  placement: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.string,
  content: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export { Popover };
