import type React from 'react';

const stopEvent = (e: React.UIEvent | Event | React.FormEvent) => {
  e.stopPropagation();
  e.preventDefault();
};

export default stopEvent;
