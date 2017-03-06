import Immutable from 'immutable';

const immutableState = new Immutable.Map({
  fetching: false,
  data: new Immutable.Map({ boardgames: [] }),
});

const queryReducer = (state = immutableState, action) => {
  switch (action.type) {
    case 'STARTING_REQUEST':
      return state.set('fetching', true);
    case 'FINISHED_REQUEST':
      return state.set('fetching', false)
             .set('data', new Immutable.Map(action.response.data));
    default:
      return state;
  }
};
export default queryReducer;
