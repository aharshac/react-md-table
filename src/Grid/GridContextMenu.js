import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'react-data-grid-addons';
const { ContextMenu, MenuItem } = Menu;

export default class GridContextMenu extends Component {
  /*
  constructor(props) {
    super(props);
    this.onRowDelete = this.onRowDelete.bind(this);
    this.onRowInsertAbove = this.onRowInsertAbove.bind(this);
    this.onRowInsertBelow = this.onRowInsertBelow.bind(this);
  }
  */
  static propTypes = {
    onRowDelete: PropTypes.func.isRequired,
    onRowInsertAbove: PropTypes.func.isRequired,
    onRowInsertBelow: PropTypes.func.isRequired,
    onColDelete: PropTypes.func.isRequired,
    onColInsertLeft: PropTypes.func.isRequired,
    onColInsertRight: PropTypes.func.isRequired,
    rowIdx: PropTypes.number,
    idx: PropTypes.number
  }

  render() {
    return (
      <ContextMenu>
        <MenuItem
          data={{rowIdx: this.props.rowIdx, idx: this.props.idx}}
          onClick={this.props.onRowInsertAbove}>
            Insert Row Above
        </MenuItem>

        <MenuItem
          data={{rowIdx: this.props.rowIdx, idx: this.props.idx}}
          onClick={this.props.onRowInsertBelow}>
            Insert Row Below
        </MenuItem>

        <MenuItem
          data={{rowIdx: this.props.rowIdx, idx: this.props.idx}}
          onClick={this.props.onRowDelete}>
            Delete Row
        </MenuItem>

        <MenuItem divider onClick={() => {}} />

        <MenuItem
          data={{rowIdx: this.props.rowIdx, idx: this.props.idx}}
          onClick={this.props.onColInsertLeft}>
            Insert Column Left
        </MenuItem>

        <MenuItem
          data={{rowIdx: this.props.rowIdx, idx: this.props.idx}}
          onClick={this.props.onColInsertRight}>
            Insert Column Right
        </MenuItem>

        <MenuItem
          data={{rowIdx: this.props.rowIdx, idx: this.props.idx}}
          onClick={this.props.onColDelete}>
            Delete Column
        </MenuItem>
      </ContextMenu>
    );
  }
}
