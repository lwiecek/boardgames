// @flow

import React from 'react';
import { connect } from 'react-redux';

import BoardGamesList from '../component/board-games-list';
import { getBoardGamesAsync } from '../action/get-board-games';

const mapStateToProps = state => ({ games: state.boardgames.get('boardgames') });

const mapDispatchToProps = dispatch => ({
  loadGames: () => dispatch(getBoardGamesAsync()),
});

class Container extends React.Component<{loadGames: Function, games: any}> {
  componentDidMount() {
    this.props.loadGames();
  }

  render() {
    return <BoardGamesList {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
