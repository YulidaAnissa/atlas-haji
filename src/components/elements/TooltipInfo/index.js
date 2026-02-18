import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import { InfoOutlineIcon, InfoIcon } from '../Icons';

function TooltipInfo({ content, className, offset, error, ...tooltipProps }) {

  const popperOptions = {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset,
        },
      },
    ],
  };

  return(
    <Tooltip content={content} error={error} placement="bottom-start" popperOptions={popperOptions} {...tooltipProps}>
      <button aria-label="info" className={className}>
        {error ? <InfoIcon fill="currentColor" /> : <InfoOutlineIcon fill="currentColor" /> }
      </button>
    </Tooltip>
  );
}

TooltipInfo.defaultProps = {
  className: '',
  content: null,
  error: false,
  offset: [-10, 12]
};

TooltipInfo.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  error: PropTypes.bool,
  offset: PropTypes.arrayOf(PropTypes.number),
};

export default TooltipInfo;