import React from 'react';
import { connect } from 'react-redux';
import getGraph from '../actions/actions';

class BoardGames extends React.Component {
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
    let search;
    const boardgames = this.props.store.get('data').get('boardgames');
    const gamesList = boardgames.map((game, index) => <li key={index}>{game.name}</li>);
    return (
      <div>
        <p>Fetch in progress: {fetchInProgress}</p>
        <ul>
        {gamesList}
        </ul>
        <input ref={ (node) => { search = node; } }></input>
        <button onClick={() => { dispatch(getGraph(BoardGames.makeSearchQuery(search.value))); } }>
          query
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state,
});
const BoardGamesContainer = connect(
 mapStateToProps,
)(BoardGames);
export default BoardGamesContainer;
