/*
const table = '| Col 1   | Col 2                                              |\n' +
  '|-------- |----------------------------------------------------|\n' +
  '|**bold** | ![Valid XHTML] (http://w3.org/Icons/valid-xhtml10) |\n' +
  '| Plain   | Value                                              |';

tableToArray(table, (error, styles, cells, rowSize, colSize) => {
  if (error) {
    console.log(error);
  } else {
    console.log(styles);
    console.log(cells);
  }
});
*/

function parseStyles(line) {
  if (/^--*[ \t]*:[ \t]*$/.test(line)) {
    return 1; // right
  } else if (/^:[ \t]*--*[ \t]*:$/.test(line)) {
    return 2; // center
  } else {
    return 0; // left
  }
}

function tableToArray(rawTable) {
  rawTable = rawTable.replace(/\\(\|)/g, '|');

  let i;
  const tableLines = rawTable.split('\n');

  if (tableLines.length < 2) {
    return null;
  }

  // strip wrong first and last column if wrapped tables are used
  for (i = 0; i < tableLines.length; ++i) {
    if (/^ {0,3}\|/.test(tableLines[i])) {
      tableLines[i] = tableLines[i].replace(/^ {0,3}\|/, '');
    }
    if (/\|[ \t]*$/.test(tableLines[i])) {
      tableLines[i] = tableLines[i].replace(/\|[ \t]*$/, '');
    }
  }

  const rawHeaders = tableLines[0].split('|').map(function(cell) {
    return cell.trim();
  });
  const rawStyles = tableLines[1].split('|').map(function(cell) {
    return cell.trim();
  });

  const rawRows = [];
  const styles = [];
  const matrix = [];

  const colSize = rawHeaders.length;

  tableLines.splice(0, 2);

  for (i = 0; i < tableLines.length; ++i) {
    if (tableLines[i].trim() === '') {
      continue;
    }
    rawRows.push(
      tableLines[i]
      .split('|')
      .map(function(cell) {
        return cell.trim();
      })
    );
  }

  if (colSize !== rawStyles.length) {
    return null;
  }

  for (i = 0; i < rawStyles.length; ++i) {
    styles.push(parseStyles(rawStyles[i]));
  }

  matrix.push(rawHeaders);

  let invalid = false;
  rawRows.map(function(row) {
    if (invalid) return null;
    invalid = (colSize !== row.length);
    matrix.push(row);
    return null;
  });
  const rowSize = matrix.length;

  if (invalid) {
    return null;
  }

  return {
    styles,
    matrix,
    rowSize,
    colSize
  };
}

export default { tableToArray };
