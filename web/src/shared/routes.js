// @flow


export const HOME_PAGE_ROUTE = '/';
export const HELLO_PAGE_ROUTE = '/hello';
export const HELLO_ASYNC_PAGE_ROUTE = '/hello-async';

export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`;
