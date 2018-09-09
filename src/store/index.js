// Create final store using all reducers and applying middleware
import { createBrowserHistory } from 'history';
// Redux utility functions
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
// Import all reducers
import * as reducers from 'reducers';
import BeltlineClient from 'beltline-client';
import thunk from 'redux-thunk';

import personApi from '../../beltlineMethods/personApi';


// Configure reducer to store state at state.router
// You can store it elsewhere by specifying a custom `routerStateSelector`
// in the store enhancer below
export const history = createBrowserHistory();
const reducer = combineReducers({ ...reducers });

const beltlineClient = new BeltlineClient('http://localhost:8080');
personApi(beltlineClient);

const store = compose(
  // Enables your middleware:
  applyMiddleware(
    thunk.withExtraArgument({ beltline: beltlineClient }),
    routerMiddleware(history)
  ),
  // applyMiddleware(beltlineReduxMiddleware(beltlineClient)),
  // Provides support for DevTools via Chrome extension
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(connectRouter(history)(reducer));

export default store;
