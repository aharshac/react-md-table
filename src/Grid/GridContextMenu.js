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
    onCellEdit: PropTypes.func.isRequired,
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
    const { rowIdx, idx } = this.props;
    const data = {rowIdx, idx};
    return (
      <ContextMenu>

        <MenuItem
          data={data}
          onClick={this.props.onCellEdit}>
            Edit Cell
        </MenuItem>

        <MenuItem divider onClick={() => {}} />

        <MenuItem
          data={data}
          onClick={this.props.onRowInsertAbove}>
            Insert Row Above
        </MenuItem>

        <MenuItem
          data={data}
          onClick={this.props.onRowInsertBelow}>
            Insert Row Below
        </MenuItem>

        <MenuItem
          data={data}
          onClick={this.props.onRowDelete}>
            Delete Row
        </MenuItem>

        <MenuItem divider onClick={() => {}} />

        <MenuItem
          data={data}
          onClick={this.props.onColInsertLeft}>
            Insert Column Left
        </MenuItem>

        <MenuItem
          data={data}
          onClick={this.props.onColInsertRight}>
            Insert Column Right
        </MenuItem>

        <MenuItem
          data={data}
          onClick={this.props.onColDelete}>
            Delete Column
        </MenuItem>
      </ContextMenu>
    );
  }
}
