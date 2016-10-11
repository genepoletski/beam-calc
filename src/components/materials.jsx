import React from 'react';

export default React.createClass({
  displayName: 'material',
  render: function () {
    return (
      <div>
        <h3>Материал</h3>
        <table className="table">
          <tbody>
            <tr className="text-center">
              <td>
                <select>
                  <option value='pine'>сосна, ель</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table table-hover">
          <tbody>
            <tr>
              <td>R<sub>и</sub> = 130</td>
              <td>E = 100 000</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});
