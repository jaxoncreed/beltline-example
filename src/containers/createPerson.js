import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


export class PersonConatiner extends Component {
  componentDidMount() {
    // this.props.dispatch(loadApp());
  }

  static propTypes = {
    loaded: PropTypes.bool
  };

  render() {
    return (
      <div>
        <h1>Create Person</h1>
        <Link to="/">Back Home</Link>
      </div>
    );
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded
  };
}

export default connect(mapStateToProperties)(PersonConatiner);
