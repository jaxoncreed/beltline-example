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
        <h1>Person</h1>
        <Link to="/">Back Home</Link>
        <form>
          <label htmlFor="name">Name: </label>
          <input id="name" type="text" />
        </form>
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
