const KEY_APP_STATE = 'appState';
const KEY_GRID_STATE = 'gridState';


/* Grid */
function saveGridState(state) {
  if (localStorage) localStorage[KEY_GRID_STATE] = JSON.stringify(state);
}

function loadGridState() {
  if (!localStorage) return null;
  return JSON.parse(localStorage.getItem(KEY_GRID_STATE));
}

function clearGridState() {
  if (localStorage) localStorage.removeItem(KEY_GRID_STATE);
}


/* App */
function saveAppState(state) {
  if (localStorage) localStorage[KEY_APP_STATE] = JSON.stringify(state);
}

function loadAppState() {
  if (!localStorage) return null;
  return JSON.parse(localStorage.getItem(KEY_APP_STATE));
}

function clearAppState() {
  if (localStorage) localStorage.removeItem(KEY_APP_STATE);
}

export { saveGridState, loadGridState, clearGridState, saveAppState, loadAppState, clearAppState };
