import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import MdTable from 'markdown-table';
import CopyToClipboard from 'react-copy-to-clipboard';

import Grid from '../Grid/Grid';
import ModalOkCancel from '../Dialog/ModalOkCancel';
import ModalAlert from '../Dialog/ModalAlert';
import ModalNewTable from '../Dialog/ModalNewTable';
import logo from './logo.svg';

import './App.css';
import './contextMenu.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowSize: 2,
      colSize: 2,
      result: '',
      newModalHidden: true,
      clearModalHidden: true,
      copyModalHidden: true,
      limitModalHidden: true,
    };

    this.handleTableNew = this.handleTableNew.bind(this);
    this.clearRows = this.clearRows.bind(this);
    this.generateMarkdown = this.generateMarkdown.bind(this);

    this.setNewModalHidden = this.setNewModalHidden.bind(this);
    this.setClearModalHidden = this.setClearModalHidden.bind(this);
    this.setCopyModalHidden = this.setCopyModalHidden.bind(this);
    this.setLimitModalHidden = this.setLimitModalHidden.bind(this);
  }

  static SETTINGS = {
    maxRows: 30,
    maxCols: 10
  }

  setNewModalHidden(newModalHidden = true) { this.setState({ newModalHidden }); }

  setClearModalHidden(clearModalHidden = true) { this.setState({ clearModalHidden }); }

  setCopyModalHidden(copyModalHidden = true) { this.setState({ copyModalHidden }); }

  setLimitModalHidden(limitModalHidden = true) { this.setState({ limitModalHidden }); }

  handleTableNew(rowSize, colSize) {
    this.grid.clearTable();
    this.setState({ result: '', rowSize: parseInt(rowSize, 10), colSize: parseInt(colSize, 10), newModalHidden: true });
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
      <CopyToClipboard text={result} onCopy={() => this.setCopyModalHidden(false)}>
        <Button bsStyle="info"><b>Copy</b></Button>
      </CopyToClipboard>
    );
  }

  render() {
    const { result, newModalHidden, clearModalHidden, copyModalHidden, limitModalHidden, rowSize, colSize } = this.state;

    return (
      <div className="App">
        <div className="AppHeader">
          <h2>React Markdown Table Generator</h2>
          <img src={logo} className="AppLogo" alt="logo" />
        </div>


        <p>
          <a href="https://www.collaborizm.com" className="shield">
            <img src="https://img.shields.io/badge/Collaborizm-sign%20up-brightgreen.svg" alt="Collaborizm" />
          </a>
          <a href="https://github.com/aharshac/react-md-table" className="shield">
            <img src="https://img.shields.io/badge/GitHub-src-blue.svg" alt="Collaborizm" />
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

        <ModalOkCancel
          txtTitle="Confirm delete"
          onOk={this.clearRows}
          onCancel={() => this.setClearModalHidden(true)}
          hidden={clearModalHidden}>
            This action cannot be undone.
        </ModalOkCancel>


        <ModalAlert
          onOk={() => this.setCopyModalHidden(true)}
          hidden={copyModalHidden}
        >
          Output is copied to the clipboard.
        </ModalAlert>

        <ModalAlert
          onOk={() => this.setLimitModalHidden(true)}
          hidden={limitModalHidden}
          hideOkButton
        >
          Limit reached.
        </ModalAlert>

        <ButtonToolbar className="toolbar">
          <Button bsStyle="primary" onClick={() => this.setNewModalHidden(false)}><b>New Table</b></Button>
          <Button bsStyle="danger" onClick={() => this.setClearModalHidden(false)}><b>Clear Rows</b></Button>
        </ButtonToolbar>

        <div className="grid">
          <Grid
            ref={el => this.grid = el}
            maxRows={App.SETTINGS.maxRows}
            maxCols={App.SETTINGS.maxCols}
            rowSize={rowSize}
            colSize={colSize}
            onLimitCrossed={() => this.setLimitModalHidden(false)}
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
