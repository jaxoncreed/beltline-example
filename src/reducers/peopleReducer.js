import { APP_LOAD } from 'constants/action-types';

const initialState = {
  subscriptions: {
    people: null,
    person: null
  },
  people: []
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case 'PEOPLE_RECEIVED':
      return { 
        ...state,
        people: action.people
      };
    case 'PERSON_RECEIVED':
      let alreadyHere = false;
      const people = state.people.map(person => {
        if (person.id === action.person.id) {
          alreadyHere = true; 
          return action.person;
        }
        return person;
      });
      if (!alreadyHere) {
        people.push(action.person);
      }
      return {
        ...state,
        people
      };
    default:
      return state;
  }
}
