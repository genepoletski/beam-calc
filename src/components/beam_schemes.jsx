import React from 'react';

export default React.createClass({
  displayName: 'beam_schemes',
  render: function () {
    var
      width = 100,
      height = 50;
    return (
      <div className="hidden">
        <h3>Расчетные схемы</h3>
        <a href="#"><img src="" width={width} height={height} /></a>
        <a href="#"><img src="" width={width} height={height} /></a>
        <a href="#"><img src="" width={width} height={height} /></a>
        <a href="#"><img src="" width={width} height={height} /></a>
        <a href="#"><img src="" width={width} height={height} /></a>
        <a href="#"><img src="" width={width} height={height} /></a>
      </div>
    );
  }
});
