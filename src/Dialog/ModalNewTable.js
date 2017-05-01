import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormControl, ControlLabel, Col, Alert } from 'react-bootstrap';

import ModalOkCancel from '../Dialog/ModalOkCancel';

export default class ModalNewTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempRows: 2,
      tempCols: 2,
      error: false
    };
    this.doOnOk = this.doOnOk.bind(this);
    this.getRowsValidationState = this.getRowsValidationState.bind(this);
    this.handleRowsChange = this.handleRowsChange.bind(this);
    this.handleColsChange = this.handleColsChange.bind(this);
  }

  static propTypes = {
    maxRows: PropTypes.number.isRequired,
    maxCols: PropTypes.number.isRequired,
    rows: PropTypes.number,
    columns: PropTypes.number,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
  }

  static defaultProps = {
    hidden: true,
    rows: 2,
    columns: 2
  }

  handleRowsChange(e) {
    this.setState({ tempRows: e.target.value });
  }

  handleColsChange(e) {
    this.setState({ tempCols: e.target.value });
  }

  getRowsValidationState() {
    const { maxRows } = this.props;
    const { tempRows } = this.state;
    if (tempRows > 0 && tempRows <= maxRows) return 'success';
    return 'error';
  }

  getColsValidationState() {
    const { maxCols } = this.props;
    const { tempCols } = this.state;
    if (tempCols > 0 && tempCols <= maxCols) return 'success';
    return 'error';
  }

  doOnOk() {
    const { onOk, maxRows, maxCols } = this.props;
    const inputRows = this.inputRows.value;
    const inputCols = this.inputCols.value;

    if (inputRows > 0 && inputRows <= maxRows && inputCols > 0 && inputCols <= maxCols) {
      this.setState({ error: false });
      if (onOk) onOk(inputRows, inputCols);
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    const { onCancel, hidden, maxRows, maxCols, rows, columns } = this.props;
    const { error } = this.state;

    return (
      <ModalOkCancel
        txtTitle="Create new table"
        onOk={this.doOnOk}
        onCancel={() => {if(onCancel) onCancel(); }}
        hidden={hidden}
      >
        <div>
          { error ?
            <Alert bsStyle="danger">
              <strong>Error!</strong> Please verify the inputs.
            </Alert>
            : null
          }

          <p>This will erase the existing table.</p> <br/>
          <Form horizontal>
            <FormGroup controlId="inputRows" validationState={this.getRowsValidationState()}>
              <Col componentClass={ControlLabel} sm={2}>
                Rows
              </Col>
              <Col sm={3}>
                <FormControl
                  type="number" min="1"
                  max={maxRows} defaultValue={rows}
                  placeholder="Rows"
                  inputRef={ref => { this.inputRows = ref; }}
                  onChange={this.handleRowsChange}
                />
              </Col>
              <Col componentClass={ControlLabel} sm={3}>
                Range: 1 - {maxRows}
              </Col>
            </FormGroup>

            <FormGroup controlId="inputCols" validationState={this.getColsValidationState()}>
              <Col componentClass={ControlLabel} sm={2}>
                Columns
              </Col>
              <Col sm={3}>
                <FormControl
                  type="number" min="1"
                  max={maxCols} defaultValue={columns}
                  placeholder="Columns"
                  inputRef={ref => { this.inputCols = ref; }}
                  onChange={this.handleColsChange}
                />
              </Col>
              <Col componentClass={ControlLabel} sm={3}>
                Range: 1 - {maxCols}
              </Col>
            </FormGroup>
          </Form>
        </div>
      </ModalOkCancel>
    );
  }
}
