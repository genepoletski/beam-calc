import React from 'react';

// TODO - remake f_to_l_ratio input/output approach

export default React.createClass({
  displayName: 'beam_single_span',
  propTypes: {
    model: React.PropTypes.object.isRequired,
    handleParamChange: React.PropTypes.func.isRequired
  },
  handleParamChange: function (e) {
    switch (e.target.name) {
    case 'f_to_l_ratio':
      this.props.model.set({
        beam_single_span: {[e.target.name]: Number(1/e.target.value)}
      });
      break;
    default:
      this.props.model.set({
        beam_single_span: {[e.target.name]: e.target.value}
      });
    }
    this.props.handleParamChange();
  },
  render: function () {
    var
      model = this.props.model,
      beamParams = model.get('beam_single_span'),
      materialParams = model.get({pine: ['E', 'Ri']}),
      profileParams = model.get({rectangular: ['W', 'I']}),
      commonClassName = 'col-xs-12';
    return (
      <div>
        <h3>Параметры однопролетной балки</h3>
        <table className={commonClassName + ' table'}>
          <tbody>
            <tr>
              <td>Q<sub>н</sub></td>
              <td>кгс &times; см</td>
              <td>
                <input
                  type="number"
                  placeholder="нормативная сила"
                  name="qn"
                  step="0.1"
                  value={beamParams.qn || ''}
                  onChange={this.handleParamChange}
                />
              </td>
            </tr>
            <tr>
              <td>Q<sub>расч</sub></td>
              <td>кгс &times; см</td>
              <td>
                <input
                  type="number"
                  placeholder="расчетная сила"
                  name="qr"
                  step="0.1"
                  value={beamParams.qr || ''}
                  onChange={this.handleParamChange}
                />
              </td>
            </tr>
            <tr>
              <td>l</td>
              <td>см</td>
              <td>
                <input
                  type="number"
                  placeholder="длина балки"
                  name='l'
                  value={beamParams.l || ''}
                  onChange={this.handleParamChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table table-hover">
          <tbody>
            <tr>
              <td>
                M<sub>max</sub>{' = '}Q<sub>расч</sub>
                &nbsp;&times;&nbsp;l<sup>2</sup>{' / 8'}
              </td>
              <td>
                M<sub>max</sub>{' = '}{beamParams.qr || '0'}
                &nbsp;&times;&nbsp;{beamParams.l || '0'}<sup>2</sup>
                {' / 8 = '}{beamParams.Mmax.toFixed(0)}
              </td>
            </tr>
          </tbody>
        </table>
        <h3>Результат проверки</h3>
        <table className="table table-hover">
          <caption><h4>I группа предельных состояний</h4></caption>
          <tbody>
            <tr>
              <td>
                W<sub>тр</sub>{' = '}M<sub>max</sub>&nbsp;
                /&nbsp;R<sub>и</sub></td>
              <td>
                W<sub>тр</sub>{' = '}{beamParams.Mmax}
                &nbsp;/&nbsp;{materialParams.Ri}
                {' = '}{beamParams.Wr.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td></td>
              <td>W = {profileParams.W.toFixed(2)}</td>
            </tr>
            <tr>
              <td>W{' > '}W<sub>тр</sub></td>
              <td>W&nbsp;{beamParams.gps1 ? '>' : '<'}&nbsp;W<sub>тр</sub></td>
            </tr>
            <tr className={beamParams.gps1 ? 'success' : ' danger'}>
              <td
                className={'text-center'}
                colSpan="2">
                {beamParams.gps1 ? 'Условие выполнено' : 'Условие не выполнено !'}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table table-hover">
          <caption><h4>II группа предельных состояний</h4></caption>
          <tbody>
            <tr>
              <td>
                {'f = 5 '}&times;&nbsp;Q<sub>н</sub>&nbsp;&times;&nbsp;
                l<sup>4</sup>&nbsp;&times;&nbsp;
                {' / ( 384 '}&times;{' E '}&times;{' I )'}</td>
              <td>
                {' f = 5 '}&times;&nbsp;{beamParams.qn || '0'}
                &nbsp;&times;&nbsp;{beamParams.l || '0'}<sup>4</sup>
                {' / ( 384 '}&times;&nbsp;{materialParams.E}&nbsp;&times;&nbsp;
                {profileParams.I.toFixed(0) || '0'}{' ) = '}
                {isFinite(beamParams.f) ? beamParams.f.toFixed(2) : ' н/д'}
              </td>
            </tr>
            <tr>
              <td>
                f / l &lt; &nbsp;
                <select
                  name="f_to_l_ratio"
                  onChange={this.handleParamChange}
                  placeholder="select">
                  <option value="200">1 / 200</option>
                  <option value="250">1 / 250</option>
                </select>
              </td>
              <td></td>
            </tr>
            <tr className={beamParams.gps2 ? ' success' : 'danger'}>
              <td
                className='text-center'
                colSpan="2">
                {beamParams.gps2 ? 'Условие выполнено' : 'Условие не выполнено !'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});
