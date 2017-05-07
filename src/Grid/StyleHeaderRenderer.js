import React from 'react';

export default function StyleHeaderRenderer({ column, onChange }) {
  const { name, key, style } = column;
  return (
    <div className="headerAlignContainer">
      <div className="headerAlignText">{name}</div>
      <select className="headerAlign" value={style} onChange={e => { if(onChange) onChange(key, e.target.value); }}>
        <option value="l">Left</option>
        <option value="c">Center</option>
        <option value="r">Right</option>
      </select>
    </div>
  );
}
