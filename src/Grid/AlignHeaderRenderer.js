import React from 'react';

export default function AlignHeaderRenderer({ column, onChange }) {
  const { name, key, align } = column;
  return (
    <div className="headerAlignContainer">
      <div className="headerAlignText">{name}</div>
      <select className="headerAlign" value={align} onChange={e => { if(onChange) onChange(key, e.target.value); }}>
        <option value="l">Left</option>
        <option value="c">Center</option>
        <option value="r">Right</option>
      </select>
    </div>
  );
}
