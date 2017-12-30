// @flow

import { connect } from 'react-redux';

import { getBoardGames } from '../action/get-board-games';
import Button from '../component/button';

const mapStateToProps = () => ({
  label: 'Say hello asynchronously and send 1234',
});

const mapDispatchToProps = dispatch => ({
  handleClick: () => { dispatch(getBoardGames()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);
