// @flow

import React from 'react';

import { APP_NAME } from '../config';

const Title = (props: any) => (
  !props.children ? <h1>{APP_NAME}</h1> : <h1>{APP_NAME} - {props.children}</h1>
);

export default Title;
