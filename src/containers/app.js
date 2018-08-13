import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadApp } from 'actions/app';
import { Link } from 'react-router-dom';


export class AppContainer extends Component {
  componentDidMount() {
    this.props.dispatch(loadApp());
  }

  static propTypes = {
    loaded: PropTypes.bool,
    people: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })).isRequired
  };

  render() {
    if (!this.props.loaded) {
      return null;
    }

    return (
      <div>
        <h1>Check out these people:</h1>
        <Link to="/person/create">Add new person</Link>
        <ul>
          {this.props.people.map(person => (
            <li key={person.id}>
              <Link to={`/person/${person.id}`}>
                {person.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded,
    people: Object.values(state.people)
  };
}

export default connect(mapStateToProperties)(AppContainer);
