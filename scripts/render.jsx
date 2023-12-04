import React from 'react';
import { renderToString } from 'react-dom/server';

import { apps } from '../common/config';

export const render = () => {
  return apps.map(({ id, Content }) => ({
    id,
    content: renderToString(<Content />),
  }));
};
