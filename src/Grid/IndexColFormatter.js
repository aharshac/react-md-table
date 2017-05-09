import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class IndexColFormatter extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
  }

  render() {
    const { value } = this.props;
    return (
      <div className="col-row-index" >
        { value }
      </div>
    );
  }
}
