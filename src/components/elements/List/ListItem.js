import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

function ListItem({ children, className, rounded, ...props }) {
  return(
    <li
      className={
        clsx(
          className,
          'hover:bg-black-100',
          {
            'rounded-lg px-2 py-1 mb-2': rounded
          }
        )
      }
      {...props}
    > 
      {children} 
    </li>
  );
}

ListItem.defaultProps = {
  className: '',
  rounded: true
};

ListItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]).isRequired,
  className: PropTypes.string,
  rounded: PropTypes.bool
};

export default ListItem;
