import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { subscribePeople } from 'actions/peopleActions';


export class AppContainer extends Component {
  componentDidMount() {
    this.props.dispatch(subscribePeople());
  }

  static propTypes = {
    people: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })).isRequired,
    dispatch: PropTypes.func.isRequired
  };
  render() {
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
    people: state.people.people
  };
}

export default connect(mapStateToProperties)(AppContainer);
