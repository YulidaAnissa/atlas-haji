import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Tippy from '@tippyjs/react';

const createArrow = (error) => (
  `<svg width="36" height="10" viewBox="10 0 36 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.4142 2.41616L25.1213 8.12327C25.6839 8.68588 26.447 9.00195 27.2426 9.00195L8.75736 9.00195C9.55301 9.00195 10.3161 8.68588 10.8787 8.12327L16.5858 2.41617C17.3668 1.63512 18.6332 1.63512 19.4142 2.41616Z" fill="${error ? '#FDF3F2' : '#2F353B'}"/>
<path d="M28 8.50195L27.6569 8.50195C26.596 8.50195 25.5786 8.08053 24.8284 7.33038L20.1213 2.62327C18.9497 1.4517 17.0503 1.4517 15.8787 2.62327L11.1716 7.33038C10.4214 8.08053 9.40401 8.50195 8.34315 8.50195L8 8.50195" stroke="${error ? '#E11900' : '#2F353B'}" stroke-linecap="round"/>
</svg>`
);

function Tooltip({ children, content, error, contentClassName, ...props }) {
  
  return(
    <Tippy
      arrow={createArrow(error)}
      content={(
        <div 
          className={
            clsx(
              'p-3 rounded text-xs', 
              error ?  'border border-danger bg-danger-accent text-danger' : 'bg-black-800 text-white', 
              contentClassName
            )}>
          {content}
        </div>
      )}
      delay={[0, 150]}
      theme={error ? 'error' : ''}
      touch={['hold', 50]}
      {...props}
    >
      {children}
    </Tippy>
  );
}

Tooltip.defaultProps = {
  children: null,
  content: null,
  contentClassName: '',
  error: false,
};

Tooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  contentClassName: PropTypes.string,
  error: PropTypes.bool,
};

export default Tooltip;