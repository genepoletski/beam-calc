import React from 'react';

export default React.createClass({
  displayName: 'profiles',
  propTypes: {
    model: React.PropTypes.object.isRequired,
    handleParamChange: React.PropTypes.func.isRequired
  },
  handleParamChange: function (e) {
    this.props.model.set({rectangular: {[e.target.name]: e.target.value}});
    this.props.handleParamChange();
  },
  render: function () {
    var
      model = this.props.model,
      params = model.get({rectangular: ['b', 'h', 'W', 'I']});

    return (
      <div>
        <h3>Профиль</h3>
        <table className='table'>
          <tbody>
            <tr>
              <td>b</td>
              <td>см</td>
              <td>
                <input
                  type="number"
                  placeholder="толщина балки"
                  name='b'
                  value={params.b || ''}
                  onChange={this.handleParamChange}
                />
              </td>
            </tr>
            <tr>
              <td>h</td>
              <td>см</td>
              <td>
                <input
                  type="number"
                  placeholder="высота балки"
                  name='h'
                  value={params.h || ''}
                  onChange={this.handleParamChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <table className='table table-hover'>
          <tbody>
            <tr>
              <td>{' W = b '}&times;{' h'}<sup>2</sup>{' / 6'}</td>
              <td>
                {' W = '}{params.b || 0}&nbsp;&times;&nbsp;
                {Math.pow(params.h, 2) || 0}{' / 6 = '}{params.W.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>{' I = b '}&times;&nbsp;h<sup>3</sup>{' / 12 '}</td>
              <td>
                {' I = '}{params.b || 0}&nbsp;&times;&nbsp;
                {Math.pow(params.h, 3) || 0}{' / 12 = '}{params.I.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});
