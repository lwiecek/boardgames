import React from 'react';
import { connect } from 'react-redux';
import getGraph from '../actions/actions';

class Query extends React.Component {
  componentDidMount() {
    const query = '{boardgames { name } }';
    const body = JSON.stringify({ query });
    this.props.dispatch(getGraph(body));
  }
  static makeSearchQuery(search) {
    const query = 'query Query($search: String) { boardgames(search: $search) { name } }';
    return JSON.stringify({
      query,
      variables: { search },
    });
  }
  render() {
    const dispatch = this.props.dispatch;
    const fetchInProgress = String(this.props.store.get('fetching'));
    let queryText;
    const boardgames = this.props.store.get('data').get('boardgames');
    const gamesList = boardgames.map((game, index) => <li key={index}>{game.name}</li>);
    return (
      <div>
        <p>Fetch in progress: {fetchInProgress}</p>
        <ul>
        {gamesList}
        </ul>
        <input ref={ (node) => { queryText = node; } }></input>
        <button onClick={() => { dispatch(getGraph(Query.makeSearchQuery(queryText.value))); } }>
          query
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state,
});
const QueryContainer = connect(
 mapStateToProps,
)(Query);
export default QueryContainer;
