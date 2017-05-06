import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LongTextFormatter extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
  }

  render() {
    const { value } = this.props;
    return (
      <div className="longTextCell" >
        <span>
          { value }
        </span>
      </div>
    );
  }
}
