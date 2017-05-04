import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import MdTable from 'markdown-table';
import CopyToClipboard from 'react-copy-to-clipboard';

import Grid from '../Grid/Grid';
import ModalOkCancel from '../Dialog/ModalOkCancel';
import ModalAlert from '../Dialog/ModalAlert';
import ModalNewTable from '../Dialog/ModalNewTable';
import ModalImportTable from '../Dialog/ModalImportTable';
import ModalEditCell from '../Dialog/ModalEditCell';
import Importer from '../Importer';
import { saveAppState, loadAppState, clearAppState } from '../Storage';

import logo from './logo.svg';

import './App.css';
import './contextMenu.css';

export default class App extends Component {
  static SETTINGS = {
    maxRows: 30,
    maxCols: 10
  }

  constructor(props) {
    super(props);
    this.state = {
      rowSize: 2,
      colSize: 2,
      result: '',
      editRow: null,
      editCol: null,
      editText: '',
      importText: '',
      alert: '',
      newModalHidden: true,
      importModalHidden: true,
      editCellHidden: true,
      clearModalHidden: true,
      alertModalHidden: true,
    };

    this.handleTableNew = this.handleTableNew.bind(this);
    this.handleTableImport = this.handleTableImport.bind(this);
    this.handleCellEdit = this.handleCellEdit.bind(this);
    this.handleCellEditDone = this.handleCellEditDone.bind(this);
    this.clearRows = this.clearRows.bind(this);
    this.generateMarkdown = this.generateMarkdown.bind(this);

    this.setNewModalHidden = this.setNewModalHidden.bind(this);
    this.setImportModalHidden = this.setImportModalHidden.bind(this);
    this.setEditCellHidden = this.setEditCellHidden.bind(this);
    this.setClearModalHidden = this.setClearModalHidden.bind(this);
    this.setAlertModalHidden = this.setAlertModalHidden.bind(this);
  }

  componentDidMount() {
    const appState = loadAppState();
    if (appState) {
      const { rowSize, colSize, importText } = appState;
      if (rowSize && rowSize) {
        this.setState({ rowSize, colSize, importText });
        return;
      }
    }
  }

  componentDidUpdate() {
    const { rowSize, colSize, importText } = this.state;
    saveAppState({ rowSize, colSize, importText });
  }

  setNewModalHidden(newModalHidden = true) { this.setState({ newModalHidden }); }

  setImportModalHidden(importModalHidden = true) { this.setState({ importModalHidden }); }

  setEditCellHidden(editCellHidden = true) { this.setState({ editCellHidden }); }

  setClearModalHidden(clearModalHidden = true) { this.setState({ clearModalHidden }); }

  setAlertModalHidden(alertModalHidden, alert = '') {  this.setState({ alertModalHidden, alert }); }

  handleTableNew(rowSize, colSize) {
    clearAppState();
    //this.grid.clearTable();
    rowSize = parseInt(rowSize, 10);
    colSize = parseInt(colSize, 10);
    this.grid.updateGrid(rowSize, colSize);
    this.setState({ result: '', rowSize, colSize, newModalHidden: true });
  }

  handleTableImport(text) {
    const data = Importer.tableToArray(text);
    if (!data) {
      this.setState({ importText: text, importModalHidden: true, alertModalHidden: false, alert: 'Could not import invalid table.' });
    } else {
      const { matrix, rowSize, colSize } = data;
      clearAppState();
      this.grid.updateGrid(rowSize, colSize, matrix);
      this.setState({ result: '', importModalHidden: true, importText: text, rowSize, colSize, alertModalHidden: true, alert: '' });
    }
  }

  handleCellEdit(row, column, text) {
    this.setState({ editRow: parseInt(row, 10), editCol: parseInt(column, 10), editText: text, editCellHidden: false });
  }

  handleCellEditDone(row, column, text) {
    this.grid.updateEditedCell(row, column, text);
    this.setState({ editRow: null, editCol: null, editText: '', editCellHidden: true });
  }

  clearRows() {
    this.grid.clearTable();
    this.setState({ result: '', clearModalHidden: true });
  }

  generateMarkdown() {
    const table = this.grid.getTableRows();
    const md = MdTable(table);
    this.setState({ result: md });
  }

  getHtmlOutput(result) {
    if (!result) return null;
    return(
      <pre className="codePre">
        {
          result.split('\n').map((line, index) => {
            return <span className="codeSpan" key={index}>{line}</span>;
          })
        }
      </pre>
    );
  }

  getCopyButton(result) {
    if (!result) return null;
    return(
      <CopyToClipboard text={result} onCopy={() => this.setAlertModalHidden(false, 'Output is copied to the clipboard.')}>
        <Button bsStyle="info"><b>Copy</b></Button>
      </CopyToClipboard>
    );
  }

  render() {
    const {
      result, rowSize, colSize,
      newModalHidden, importModalHidden, editCellHidden, clearModalHidden, alertModalHidden, alert,
      editRow, editCol, editText
    } = this.state;

    return (
      <div className="App">
        <div className="AppHeader">
          <h2>React Markdown Table Generator</h2>
          <img src={logo} className="AppLogo" alt="logo" />
        </div>

        <p>
          <a href="https://www.collaborizm.com" className="shield">
            <img src="https://img.shields.io/badge/Collaborizm-sign%20up-blue.svg" alt="Collaborizm" />
          </a>
          <a href="https://github.com/aharshac/react-md-table" className="shield">
            <img src="https://img.shields.io/badge/GitHub-src-orange.svg" alt="Collaborizm" />
          </a>
        </p>

        <ModalNewTable
          maxRows={App.SETTINGS.maxRows}
          maxCols={App.SETTINGS.maxCols}
          rows={rowSize}
          columns={colSize}
          onOk={this.handleTableNew}
          onCancel={() => this.setNewModalHidden(true)}
          hidden={newModalHidden} />

        <ModalImportTable
          text=""
          onOk={this.handleTableImport}
          onCancel={() => this.setImportModalHidden(true)}
          hidden={importModalHidden} />

        <ModalEditCell
          row={editRow}
          column={editCol}
          text={editText}
          onOk={this.handleCellEditDone}
          onCancel={() => this.setEditCellHidden(true)}
          hidden={editCellHidden} />

        <ModalOkCancel
          txtTitle="Confirm delete"
          onOk={this.clearRows}
          onCancel={() => this.setClearModalHidden(true)}
          hidden={clearModalHidden}>
            This action cannot be undone.
        </ModalOkCancel>

        <ModalAlert
          onOk={() => this.setAlertModalHidden(true)}
          message={alert}
          hidden={alertModalHidden}
          hideOkButton />

        <ButtonToolbar className="toolbar">
          <Button bsStyle="primary" onClick={() => this.setNewModalHidden(false)}><b>New Table</b></Button>
          <Button bsStyle="primary" onClick={() => this.setImportModalHidden(false)}><b>Import Table</b></Button>
          <Button bsStyle="danger" onClick={() => this.setClearModalHidden(false)}><b>Clear Rows</b></Button>
        </ButtonToolbar>

        <div className="grid">
          <Grid
            ref={el => this.grid = el}
            maxRows={App.SETTINGS.maxRows}
            maxCols={App.SETTINGS.maxCols}
            rowSize={rowSize}
            colSize={colSize}
            onLimitCrossed={() => this.setAlertModalHidden(false, 'Limit reached.')}
            onCellDoubleClick={this.handleCellEdit}
          />
        </div>

        <ButtonToolbar className="toolbar">
          <Button bsStyle="success" onClick={this.generateMarkdown}><b>Generate Markdown</b></Button>
          { this.getCopyButton(result) }
        </ButtonToolbar>

        <div className="resultContainer">
          { this.getHtmlOutput(result) }
        </div>
      </div>
    );
  }
}
