import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';

import GridContextMenu from './GridContextMenu';

class CellRenderer extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
  }

  render() {
    const { value } = this.props;
    return (
      <div className="rowIndexCell" >
        { value }
      </div>
    );
  }
}

export default class Grid extends Component {
  static MAX_COLS = 10;
  static MAX_ROWS = 10;

  constructor(props) {
    super(props);
    /*
    const { rowSize, colSize } = props;
    let rows = this.clearRows(rowSize);

    let columns = [{ key: 'ID', name: '', width: 50, editable: false, formatter: CellRenderer }];
    for (let i = 1; i < colSize + 1; i++) {
      columns.push({ key: 'col' + i.toString(), name: 'A', width: null, editable: true });
    }
    columns = this.replaceColumnHeaders(columns);
    */

    this.state = {
      rows: [],
      columns: [],
      rowSize: 2,
      colSize: 2,
      lastKey: 1000
    };

    this.updateGrid = this.updateGrid.bind(this);
    this.clearTable = this.clearTable.bind(this);
    this.getTableRows = this.getTableRows.bind(this);
    this.rowGetter = this.rowGetter.bind(this);
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);

    this.deleteRow = this.deleteRow.bind(this);
    this.insertRowAbove = this.insertRowAbove.bind(this);
    this.insertRowBelow = this.insertRowBelow.bind(this);
    this.insertRow = this.insertRow.bind(this);

    this.deleteCol = this.deleteCol.bind(this);
    this.insertColLeft = this.insertColLeft.bind(this);
    this.insertColRight = this.insertColRight.bind(this);
    this.insertCol = this.insertCol.bind(this);
  }

  static propTypes = {
    maxRows: PropTypes.number,
    maxCols: PropTypes.number,
    rowSize: PropTypes.number,
    colSize: PropTypes.number,
    onLimitCrossed: PropTypes.func,
  }

  static defaultProps = {
    maxRows: 30,
    maxCols: 10,
    rowSize: 2,
    colSize: 2,
  }

  componentDidMount() {
    const { rowSize, colSize } = this.props;
    this.updateGrid(rowSize, colSize);
  }

  componentWillReceiveProps(nextProps) {
    const { rowSize, colSize } = this.props;

    if (nextProps.rowSize === rowSize && nextProps.colSize === colSize) {
      return;
    }

    this.updateGrid(nextProps.rowSize, nextProps.colSize);
  }

  updateGrid(rowSize, colSize) {
    let rows = this.clearRows(rowSize);
    let columns = [{ key: 'ID', name: '', width: 50, editable: false, formatter: CellRenderer }];
    for (let i = 1; i < colSize + 1; i++) {
      columns.push({ key: 'col' + i.toString(), name: 'A', width: null, editable: true });
    }
    columns = this.replaceColumnHeaders(columns);

    this.setState({
      rows,
      columns,
      rowSize,
      colSize
    });
  }

  clearRows(rowSize) {
    let rows = [];
    for (let i = 0; i < rowSize; i++) {
      rows.push({ });
    }
    return this.replaceRowHeaders(rows);
  }

  clearTable() {
    const { rowSize } = this.state;
    let rows = this.clearRows(rowSize);
    this.setState({ rows, rowSize });
  }

  getTableRows() {
    const { rows, columns } = this.state;

    let keys = [], table = [];
    for(let col = 1; col < columns.length; col++) {
      keys.push(columns[col].key);
    }

    for(let row = 0; row < rows.length; row++) {
      let tableRow = [];
      for(let col = 0; col < keys.length; col++) {
        const key = keys[col];
        tableRow.push(rows[row][key]);
      }
      table.push(tableRow);
    }

    return table;
  }

  replaceColumnHeaders(columns) {
    for (let i = 1; i < columns.length; i++) {
      columns[i].name = String.fromCharCode(97 + i - 1).toUpperCase();
    }
    return columns;
  }

  replaceRowHeaders(rows) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].ID = i + 1;
      rows[i].className = 'react-grid-HeaderCell';
    }
    return rows;
  }

  rowGetter(rowIdx) {
    return this.state.rows[rowIdx];
  }

  deleteRow(e, { rowIdx }) {
    let rows = [...this.state.rows];
    if (rows.length === 1) {
      return;
    }

    rows.splice(rowIdx, 1);
    rows = this.replaceRowHeaders(rows);

    let columns = [...this.state.columns];
    columns = this.replaceColumnHeaders(columns);

    const rowSize = rows.length, colSize = columns.length;
    this.setState({ rows, columns, rowSize, colSize });
  }

  insertRowAbove(e, { rowIdx }) {
    this.insertRow(rowIdx);
  }

  insertRowBelow(e, { rowIdx }) {
    this.insertRow(rowIdx + 1);
  }

  insertRow(rowIdx) {
    const length = this.state.rows.length;
    const { onLimitCrossed } = this.props;
    if (length > this.props.maxRows) {
      if (onLimitCrossed) onLimitCrossed();
      return;
    }

    const newRow = { };
    let rows = [...this.state.rows];
    rows.splice(rowIdx, 0, newRow);
    rows = this.replaceRowHeaders(rows);

    let columns = [...this.state.columns];
    columns = this.replaceColumnHeaders(columns);

    const rowSize = rows.length, colSize = columns.length;
    this.setState({ columns, rows, rowSize, colSize });
  }

  deleteCol(e, { idx }) {
    let columns = [...this.state.columns];
    if (idx === 0 || columns.length <= 2) {
      return;
    }

    columns.splice(idx, 1);
    columns = this.replaceColumnHeaders(columns);
    let rows = [...this.state.rows];
    rows = this.replaceRowHeaders(rows);

    const rowSize = rows.length, colSize = columns.length;
    this.setState({ columns, rows, rowSize, colSize });
  }

  insertColLeft(e, { idx }) {
    if ( idx === 0 ) {
      return;
    }
    this.insertCol(idx);
  }

  insertColRight(e, { idx }) {
    this.insertCol(idx + 1);
  }

  insertCol(colIdx) {
    const length = this.state.columns.length;
    const { onLimitCrossed } = this.props;
    if (length > this.props.maxCols) {
      if (onLimitCrossed) onLimitCrossed();
      return;
    }
    const lastKey = ++this.state.lastKey;
    const key = lastKey.toString();

    const newCol = { key: 'col' + key, name: key, width: null, editable: true };

    let columns = [...this.state.columns];
    columns.splice(colIdx, 0, newCol);
    columns = this.replaceColumnHeaders(columns);

    let rows = [...this.state.rows];
    rows = this.replaceRowHeaders(rows);

    const rowSize = rows.length, colSize = columns.length;
    this.setState({ columns, rows, rowSize, colSize, lastKey: lastKey });
  }

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    let rows = this.state.rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }
    this.setState({ rows });
  }

  render() {
    return (
      <ReactDataGrid
        contextMenu={
          <GridContextMenu
            onRowDelete={this.deleteRow}
            onRowInsertAbove={this.insertRowAbove}
            onRowInsertBelow={this.insertRowBelow}
            onColDelete={this.deleteCol}
            onColInsertLeft={this.insertColLeft}
            onColInsertRight={this.insertColRight}
          />
        }
        columns={this.state.columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={300}
        height={null}
        enableCellSelect={true}
        onGridRowsUpdated={this.handleGridRowsUpdated}
      />
    );
  }
}
