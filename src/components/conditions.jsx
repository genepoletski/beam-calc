import React from 'react';

export default React.createClass({
  displayName: 'conditions',
  render: function () {
    return (
      <div>
        <h3>Условия</h3>
        <table className="table">
          <tbody>
            <tr className="text-center">
              <td>
                <select>
                  <option value='1'>I группа</option>
                  <option value='2'>II группа</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table table-hover">
          <tbody>
            <tr>
              <td>K<sub>c</sub> = 1.0</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});
