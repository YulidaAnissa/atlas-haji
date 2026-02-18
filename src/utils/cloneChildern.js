import React from 'react';

export default function cloneChildren(children, props) {
  return React.Children.map(children, child => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });
}