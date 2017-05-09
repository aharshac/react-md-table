import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ModalOkCancel from '../Dialog/ModalOkCancel';

export default class ModalImportTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempText: props.text,
    };
    this.doOnOk = this.doOnOk.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  static propTypes = {
    text: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
  }

  static defaultProps = {
    hidden: true,
  }

  componentWillReceiveProps(nextProps) {
    const { text } = this.props;
    if (nextProps.text === text) {
      return;
    }
    this.setState({ tempText: nextProps.text });
  }

  handleTextChange(e) {
    this.setState({ tempText: e.target.value });
  }

  doOnOk() {
    const { onOk } = this.props;
    const { tempText } = this.state;
    if (onOk) onOk(tempText);
  }

  render() {
    const { onCancel, hidden } = this.props;
    const { tempText } = this.state;

    return (
      <ModalOkCancel
        txtTitle="Import Markdown Table"
        onOk={this.doOnOk}
        onCancel={() => {if(onCancel) onCancel(); }}
        hidden={hidden}
        large>

        <textarea
          className="import-edit"
          onChange={this.handleTextChange}
          value={tempText}
          placeholder="Markdown Table"
        />
      </ModalOkCancel>
    );
  }
}
