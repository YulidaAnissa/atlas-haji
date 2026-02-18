import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from 'next/link';
import { ListItem } from '.';

function ListSearchItem ({ append, prepend, className, title, description, onClick, href }) {
  return (
    <ListItem className={clsx('flex flex-wrap', className)}>
      <Link
        className="flex-1 flex items-center"
        href={href}
        onClick={onClick}
      >
        {prepend()}
        <div className="flex flex-col flex-wrap">
          <span className={`${description && 'font-medium'} text-sm md:text-base`}>{title}</span>
          <span className="text-xs md:text-sm text-black-600">{description}</span>
        </div>
      </Link>
      {append()}
    </ListItem>
  );
}

ListSearchItem.defaultProps = {
  append: () => {},
  className: 'min-h-12',
  description: '',
  href: '',
  onClick: () => {},
  prepend: () => {},
  title: ''
};

ListSearchItem.propTypes = {
  append: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  description: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  prepend: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  title: PropTypes.string
};

export default ListSearchItem;
