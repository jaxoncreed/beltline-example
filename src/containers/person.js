import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { subscribePerson, changeName } from 'actions/peopleActions';


export class PersonConatiner extends Component {
  componentDidMount() {
    this.props.dispatch(subscribePerson(this.props.name));
  }

  static propTypes = {
    person: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  };

  render() {
    if (!this.props.person) {
      return (
        <div>
          <h1>Person not found</h1>
          <Link to="/">Back Home</Link>
        </div>
      )
    }
    return (
      <div>
        <h1>Person: {this.props.person.name}</h1>
        <Link to="/">Back Home</Link>
        <form>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            value={this.props.person.name}
            onChange={(e) => this.props.dispatch(changeName(e.target.value))}
          />
        </form>
      </div>
    );
  }
}

function mapStateToProperties(state) {
  const name = state.router.location.pathname.split('/')[2];
  return {
    name,
    person: state.people.people.find(person => person.id === name)
  };
}

export default connect(mapStateToProperties)(PersonConatiner);
