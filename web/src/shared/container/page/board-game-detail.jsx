// @flow

import React from 'react';
import { connect } from 'react-redux';

import { getBoardGamesAsync } from '../../action/get-board-games';
import BoardGamesDetailPage from '../../component/page/board-game-detail';

const mapStateToProps = state => ({
  game: state.boardgames.get('boardgames') ? state.boardgames.get('boardgames').get(0) : undefined,
});

const mapDispatchToProps = dispatch => ({
  loadGame: slug => dispatch(getBoardGamesAsync({ slug })),
});

class Container extends React.Component<{loadGame: Function, game: any, match: any}> {
  componentDidMount() {
    this.props.loadGame(this.props.match.params.boardGameSlug);
  }

  render() {
    return <BoardGamesDetailPage {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
