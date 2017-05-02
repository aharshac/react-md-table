import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

export default class ModalOkCancel extends Component {
  static propTypes = {
    txtTitle: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]).isRequired,
    txtOk: PropTypes.string,
    txtCancel: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    large: PropTypes.bool,
  }

  static defaultProps = {
    txtOk: 'Ok',
    txtCancel: 'Cancel',
    hidden: true,
    large: true
  }

  render() {
    const { txtTitle, children, txtOk, txtCancel, onOk, onCancel, hidden, large } = this.props;

    return (
      <Modal show={!hidden} onHide={() => { if(onCancel) onCancel(); }} bsSize={large ? 'large' : 'small'}>
        <Modal.Header closeButton>
          <Modal.Title>{txtTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={() => {if(onOk) onOk(); }}>{txtOk}</Button>
          <Button onClick={() => {if(onCancel) onCancel(); }}>{txtCancel}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
