import { APP_LOAD } from 'constants/action-types';

const initialState = {
  'Jeff': {
    id: 'Jeff',
    uri: 'http://example.com/owl/families#Jeff',
    name: 'Jeff'
  },
  'Ellen': {
    id: 'Ellen',
    uri: 'http://example.com/owl/families#Ellen',
    name: 'Ellen'
  },
  'Jack': {
    id: 'Jack',
    uri: 'http://example.com/owl/families#Jack',
    name: 'Jack'
  }
};

export default function app(state = initialState, action) {
  return state;
//   switch (action.type) {
//     case APP_LOAD:
//       return { ...state, loaded: true };
//     default:
//       return state;
//   }
}
