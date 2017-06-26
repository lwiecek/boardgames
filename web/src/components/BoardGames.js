import React from 'react';
import { connect } from 'react-redux';
import getGraph from '../actions/actions';

class BoardGames extends React.Component {
  static makeSearchQuery(search) {
    const query = 'query Query($search: String) { boardgames(search: $search) { id, name, slug } }';
    return {
      query,
      variables: { search },
    };
  }
  static makeIDQuery(id) {
    const query = 'query Query($ids: [Int!]) { boardgames(ids: $ids) { id, name, slug } }';
    return {
      query,
      variables: { ids: [id] },
    };
  }
  componentDidMount() {
    this.props.dispatch(getGraph(BoardGames.makeSearchQuery('')));
  }
  render() {
    const dispatch = this.props.dispatch;
    const fetchInProgress = String(this.props.store.get('fetching'));
    let search;
    const boardgames = this.props.store.get('data').get('boardgames');
    const gameOnClick = id => () => dispatch(getGraph(BoardGames.makeIDQuery(id)));
    const gamesList = boardgames.map(
      (game, index) =>
        <li key={index}><a onClick={gameOnClick(game.id)}>{game.name}</a></li>,
    );
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
