import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';

import IndexColFormatter from './IndexColFormatter';
import LongTextFormatter from './LongTextFormatter';
import GridContextMenu from './GridContextMenu';
import AlignHeaderRenderer from './AlignHeaderRenderer';
import { saveGridState, loadGridState } from '../Storage';


export default class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      columns: [],
      columnStyles: {},
      lastColKey: 1000
    };

    this.loadSavedState = this.loadSavedState.bind(this);
    this.handleCellKeydown = this.handleCellKeydown.bind(this);
    this.handleCellEditAction = this.handleCellEditAction.bind(this);
    this.updateEditedCell = this.updateEditedCell.bind(this);
    this.handleColumnStylesChange = this.handleColumnStylesChange.bind(this);
    this.getColumnObject = this.getColumnObject.bind(this);
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
    onCellEditAction: PropTypes.func,
  }

  static defaultProps = {
    maxRows: 30,
    maxCols: 10,
    rowSize: 2,
    colSize: 2,
  }

  componentDidMount() {
    this.loadSavedState();
  }

  componentDidUpdate() {
    saveGridState(this.state);
  }

  loadSavedState() {
    const { rowSize, colSize } = this.props;
    const gridState = loadGridState();
    if (gridState) {
      const { rows, columns, lastColKey, columnStyles } = gridState;
      if (rows && columns && lastColKey && columnStyles) {
        this.setState({
          rows: this.replaceRowHeaders(rows),
          columns: this.replaceColumnHeaders(columns),
          columnStyles,
          lastColKey
        });
        return;
      }
    }
    this.updateGrid(rowSize, colSize);
  }

  /* Cell popout */
  handleCellKeydown(ev, args) {
    if (ev.key === 'Enter') {
      this.handleCellEditAction(ev, args);
    }
  }

  handleCellEditAction(ev, { rowIdx, idx }) {
    if (idx === 0) return;
    const { rows, columns } = this.state;
    const key = columns[idx].key;
    const text = rows[rowIdx][key];
    const { onCellEditAction } = this.props;
    if(onCellEditAction) onCellEditAction(rowIdx, idx, text);
  }

  updateEditedCell(row, column, text) {
    let rows = this.state.rows;
    let currentRow = this.state.rows[row];
    let columns = this.state.columns;

    const key = columns[column].key;
    currentRow[key] = text;

    let newData = update(rows, { $splice: [[row, 1, currentRow]] });
    this.setState({ rows: newData });
  }

  handleColumnStylesChange(key, align) {
    const columns = this.state.columns.slice();
    const idx = columns.findIndex(element => { return element.key === key; });
    if (idx <= 0) return;

    const { columnStyles } = this.state;
    let newColumnStyles = update(columnStyles, { $merge: { [key]: align } });

    const currentColumn = columns[idx];
    //currentColumn.align = align;
    let newColumns = update(columns, { $splice: [[idx, 1, this.getColumnObject(currentColumn.radix, align)]] });
    this.setState({ columns: newColumns, columnStyles: newColumnStyles });
  }

  getColumnObject(i, align = null) {
    if (i === 0 ) return {
      key: 'ID', name: '', width: 50, locked: true, cellClass: 'no-outline',
      editable: false, formatter: IndexColFormatter
    };

    const obj = {
      key: 'col' + i.toString(),
      radix: i,
      name:  String.fromCharCode(97 + i - 1).toUpperCase(),
      width: 150,
      editable: false,
      formatter: LongTextFormatter,
      headerRenderer: <AlignHeaderRenderer onChange={this.handleColumnStylesChange} />,
      events: {  onDoubleClick: this.handleCellEditAction, onKeyDown: this.handleCellKeydown }
    };
    if(align) obj.align = align;
    return obj;
  }

  /* Table resizing */
  updateGrid(rowSize, colSize) {
    let rows = this.clearRows(rowSize);
    let columns = [this.getColumnObject(0)];
    for (let i = 1; i < colSize + 1; i++) {
      const column = this.getColumnObject(i, 'l');
      columns.push(column);
    }
    //columns = this.replaceColumnHeaders(columns);
    this.setState({ rows, columns, columnStyles: {} });
  }

  /* Import from MD */
  importGrid(rowSize, colSize, matrix, styles) {
    let columnStyles = {};
    let rows = this.clearRows(rowSize);
    let columns = [this.getColumnObject(0)];
    for (let i = 1; i < colSize + 1; i++) {
      const column = this.getColumnObject(i, styles[i-1]);
      columnStyles[column.key] = styles[i-1];
      columns.push(column);
    }
    //columns = this.replaceColumnHeaders(columns);
    for(let row = 0; row < rows.length; row++) {
      for(let col = 1; col < columns.length; col++) {
        const key = columns[col].key;
        rows[row][key] = matrix[row][col-1];
      }
    }

    this.setState({ rows, columns });
  }


  clearRows(rowSize) {
    let rows = [];
    for (let i = 0; i < rowSize; i++) {
      rows.push({ });
    }
    return this.replaceRowHeaders(rows);
  }

  /* Reset table rows by button */
  clearTable() {
    const { rowSize } = this.props;
    let rows = this.clearRows(rowSize);
    this.setState({ rows });
  }


  /* Non header rows */
  getTableRows(onComplete = null) {
    const { rows, columns } = this.state;

    let keys = [], table = [], align = [];
    for(let col = 1; col < columns.length; col++) {
      keys.push(columns[col].key);
      align.push(columns[col].align ? columns[col].align : 'l');
    }

    for(let row = 0; row < rows.length; row++) {
      let tableRow = [];
      for(let col = 0; col < keys.length; col++) {
        const key = keys[col];
        tableRow.push(rows[row][key]);
      }
      table.push(tableRow);
    }

    if (onComplete) onComplete(table, align);
    //return table;
  }


  /* Row and col headers */

  replaceColumnHeaders(columns) {
    columns[0] = this.getColumnObject(0);
    for (let i = 1; i < columns.length; i++) {
      // const key = columns[i].key;
      columns[i].name = String.fromCharCode(97 + i - 1).toUpperCase();
      columns[i].formatter = LongTextFormatter;
      columns[i].headerRenderer = <AlignHeaderRenderer onChange={this.handleColumnStylesChange} />;
      columns[i].events = {  onDoubleClick: this.handleCellEditAction, onKeyDown: this.handleCellKeydown };
      // columns[i].align = style;
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


  /* Row */

  rowGetter(rowIdx) {
    return this.state.rows[rowIdx];
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
    if (length > this.props.maxRows && onLimitCrossed) {
      onLimitCrossed();
      return;
    }

    const newRow = { };
    let rows = [...this.state.rows];
    rows.splice(rowIdx, 0, newRow);
    rows = this.replaceRowHeaders(rows);

    let columns = [...this.state.columns];
    columns = this.replaceColumnHeaders(columns);

    this.setState({ columns, rows });
  }

  deleteRow(e, { rowIdx }) {
    let rows = [...this.state.rows];
    const { onLimitCrossed } = this.props;
    if (rows.length === 1 && onLimitCrossed) {
      onLimitCrossed();
      return;
    }

    rows.splice(rowIdx, 1);
    rows = this.replaceRowHeaders(rows);

    let columns = [...this.state.columns];
    columns = this.replaceColumnHeaders(columns);

    this.setState({ rows, columns });
  }


  /* Column */

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
    if (length > this.props.maxCols && onLimitCrossed) {
      onLimitCrossed();
      return;
    }
    const lastColKey = ++this.state.lastColKey;
    const newCol = this.getColumnObject(lastColKey);

    let columns = [...this.state.columns];
    let rows = [...this.state.rows];
    columns.splice(colIdx, 0, newCol);
    columns = this.replaceColumnHeaders(columns);
    rows = this.replaceRowHeaders(rows);
    this.setState({ columns, rows, lastColKey });
  }

  deleteCol(e, { idx }) {
    let columns = [...this.state.columns];
    const { onLimitCrossed } = this.props;
    if (idx === 0) {
      return;
    }
    if (columns.length === 2 && onLimitCrossed) {
      onLimitCrossed();
      return;
    }

    columns.splice(idx, 1);
    columns = this.replaceColumnHeaders(columns);
    let rows = [...this.state.rows];
    rows = this.replaceRowHeaders(rows);
    this.setState({ columns, rows });
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
    const { rows, columns } = this.state;
    return (
      <ReactDataGrid
        contextMenu={
          <GridContextMenu
            onCellEdit={this.handleCellEditAction}
            onRowDelete={this.deleteRow}
            onRowInsertAbove={this.insertRowAbove}
            onRowInsertBelow={this.insertRowBelow}
            onColDelete={this.deleteCol}
            onColInsertLeft={this.insertColLeft}
            onColInsertRight={this.insertColRight}
          />
        }
        columns={columns}
        rowGetter={this.rowGetter}
        rowsCount={rows.length}
        minHeight={400}
        height={null}
        enableCellSelect={true}
        onGridRowsUpdated={this.handleGridRowsUpdated}
      />
    );
  }
}
