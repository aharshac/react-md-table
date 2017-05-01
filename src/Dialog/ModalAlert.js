import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

export default class ModalAlert extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]).isRequired,
    txtOk: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    hideOkButton: PropTypes.bool,
  }

  static defaultProps = {
    txtOk: 'Ok',
    hidden: true,
    hideOkButton: false
  }

  render() {
    const {  children, txtOk,  onOk, hidden, hideOkButton } = this.props;

    return (
      <Modal show={!hidden} onHide={() => {if(onOk) onOk(); }}>
        <Modal.Body>
          {children}
        </Modal.Body>
        { !hideOkButton ?
          <Modal.Footer>
            <Button bsStyle="primary" onClick={() => {if(onOk) onOk(); }}>{txtOk}</Button>
          </Modal.Footer>
          : null
        }
      </Modal>
    );
  }
}
