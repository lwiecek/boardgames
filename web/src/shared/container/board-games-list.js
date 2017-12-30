// @flow

import { connect } from 'react-redux';

import BoardGamesList from '../component/board-games-list';

const mapStateToProps = state => ({
  games: state.boardgames.get('all'),
});

export default connect(mapStateToProps)(BoardGamesList);
