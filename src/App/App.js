import React, { Component } from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import MdTable from 'markdown-table';
import CopyToClipboard from 'react-copy-to-clipboard';

import Grid from '../Grid/Grid';
import ModalOkCancel from '../Dialog/ModalOkCancel';
import ModalAlert from '../Dialog/ModalAlert';
import ModalNewTable from '../Dialog/ModalNewTable';
import ModalImportTable from '../Dialog/ModalImportTable';
import ModalEditCell from '../Dialog/ModalEditCell';
import ModalHelp from '../Dialog/ModalHelp';
import Importer from '../Importer';
import { saveAppState, loadAppState, clearAppState } from '../Storage';

import LogoReact from './LogoReact.svg';
import LogoCollaborizm from './LogoCollaborizm.svg';

import './AppStyles.css';

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
      helpModalHidden: true,
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

  setHelpModalHidden = (helpModalHidden) => this.setState({ helpModalHidden });


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
      this.grid.importGrid(rowSize, colSize, matrix);
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
    this.grid.getTableRows((table, align) => {
      const md = MdTable(table, { align });
      this.setState({ result: md });
    });
  }

  getHtmlOutput(result) {
    if (!result) return null;
    return(
      <pre className="result-code">
        {
          result.split('\n').map((line, index) => {
            return <span className="result-code-line" key={index}>{line}</span>;
          })
        }
      </pre>
    );
  }

  getCopyButton(result) {
    if (!result) return null;
    return(
      <CopyToClipboard text={result} onCopy={() => this.setAlertModalHidden(false, 'Output is copied to the clipboard.')}>
        <Button bsStyle="default"><Glyphicon glyph="copy" /> <b>Copy Output</b></Button>
      </CopyToClipboard>
    );
  }

  render() {
    const {
      result, rowSize, colSize,
      newModalHidden, importModalHidden, editCellHidden, clearModalHidden, alertModalHidden, alert, helpModalHidden,
      editRow, editCol, editText, importText
    } = this.state;

    return (
      <div className="app">
        <div className="app-header">
          <h2>React Markdown Table Generator</h2>
          <a href="https://www.collaborizm.com" target="_blank">
            <img src={LogoCollaborizm} className="logo-collaborizm" alt="logo" />
          </a>
          <img src={LogoReact} className="logo-react" alt="logo" />

          <a className="github-ribbon" href="https://github.com/aharshac/react-md-table" target="_blank">
            <img src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" />
          </a>
        </div>

        <ModalNewTable
          maxRows={App.SETTINGS.maxRows}
          maxCols={App.SETTINGS.maxCols}
          rows={rowSize}
          columns={colSize}
          onOk={this.handleTableNew}
          onCancel={() => this.setNewModalHidden(true)}
          hidden={newModalHidden} />

        <ModalImportTable
          text={importText}
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

        <ModalHelp
          onOk={() => this.setHelpModalHidden(true)}
          hidden={helpModalHidden} />

        <div className="large-screen-only">
          <ButtonToolbar className="toolbar">
            <Button bsStyle="primary" onClick={() => this.setNewModalHidden(false)}><Glyphicon glyph="tasks" /> <b>New Table</b></Button>
            <Button bsStyle="info" onClick={() => this.setImportModalHidden(false)}><Glyphicon glyph="import" /> <b>Import Table</b></Button>
            <Button bsStyle="danger" onClick={() => this.setClearModalHidden(false)}><Glyphicon glyph="trash" /> <b>Clear Rows</b></Button>
            <Button bsStyle="warning" onClick={() => this.setHelpModalHidden(false)} className="toolbar-align-right"><Glyphicon glyph="question-sign" /> <b>Help</b></Button>
          </ButtonToolbar>

          <div className="grid">
            <Grid
              ref={el => this.grid = el}
              maxRows={App.SETTINGS.maxRows}
              maxCols={App.SETTINGS.maxCols}
              rowSize={rowSize}
              colSize={colSize}
              onLimitCrossed={() => this.setAlertModalHidden(false, 'Limit reached.')}
              onCellEditAction={this.handleCellEdit}
            />
          </div>

          <ButtonToolbar className="toolbar">
            <Button bsStyle="success" onClick={this.generateMarkdown}><Glyphicon glyph="check" /> <b>Generate Markdown</b></Button>
            { this.getCopyButton(result) }
          </ButtonToolbar>

          <div className="result-container">
            { this.getHtmlOutput(result) }
          </div>
        </div>

        <div className="small-screen-only">
          Screen size not supported
        </div>


        <footer>
          <p>
            App by <a href="https://www.collaborizm.com/profile/Hyt3y6XK?utm_content=user_link&utm_source=user_Hyt3y6XK" target="_blank">Harsha Alva</a>.
            Made for <a href="https://www.collaborizm.com/" target="_blank">Collaborizm</a> with <Glyphicon glyph="heart" /> and <a href="https://facebook.github.io/react/" target="_blank">React</a>
          </p>
        </footer>
      </div>
    );
  }
}
