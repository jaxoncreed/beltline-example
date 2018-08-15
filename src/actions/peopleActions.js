

export function subscribePeople() {
  return async (dispatch, getState, { beltline }) => {
    const subscription = await beltline.subscribe('people', {}, (newGraph) => {
      const peopleTriples = newGraph.triples.filter(t => 
        t.predicate.nominalValue === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#name');
      const peopleJSON = peopleTriples.map(t => ({
        id: t.subject.nominalValue.split('#')[1],
        uri: t.subject.nominalValue,
        name: t.object.nominalValue
      }));
      dispatch({
        type: 'PEOPLE_RECEIVED',
        people: peopleJSON
      });
    });
    console.log(subscription);
  }
}

export function subscribePerson(id) {
  return async (dispatch, getState, { beltline }) => {
    const subscription = await beltline.subscribe('person', { id }, (newGraph) => {
      const peopleTriples = newGraph.triples.filter(t => 
        t.predicate.nominalValue === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#name');
      const peopleJSON = peopleTriples.map(t => ({
        id: t.subject.nominalValue.split('#')[1],
        uri: t.subject.nominalValue,
        name: t.object.nominalValue
      }));
      dispatch({
        type: 'PERSON_RECEIVED',
        person: peopleJSON[0]
      });
    });
  }
}

export function changeName(id, newName) {
  return (dispatch, getState, { beltline }) => {
    beltline.call('changeName', { id, newName });
  }
}