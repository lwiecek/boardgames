// @flow

import { connect } from 'react-redux';

import MessageAsync from '../component/message';

const mapStateToProps = state => ({
  message: state.boardgames.get('boardgame') || '',
});

export default connect(mapStateToProps)(MessageAsync);
