import React from 'react';

export default React.createClass({
  displayName: 'load_roof',
  getInitialState: function() {
    return {
      angle: null,
      snowLoad: 0,
      raftersSpacing: 0,
      roofStructureTopLayerWeight: 0,
      roofStructureCoreLayerWeight: 0,
      roofStructureBottomLayerWeight: 0
    };
  },
  handleAngleChange: function (e) {
    this.setState({angle: e.target.value});
  },
  handleSnowLoadChange: function(e) {
    this.setState({snowLoad: e.target.value});
  },
  handleRoofStructureChange: function (e) {
    switch (e.target.name) {
    case 'roofStructureTopLayer':
      this.setState({roofStructureTopLayerWeight: e.target.value});
      break;
    case 'roofStructureCoreLayer':
      this.setState({roofStructureCoreLayerWeight: e.target.value});
      break;
    case 'roofStructureBottomLayer':
      this.setState({roofStructureBottomLayerWeight: e.target.value});
      break;
    default:
    }
  },
  handleRaftersSpacing: function (e) {
    this.setState({raftersSpacing: e.target.value});
  },
  getMu: function() {
    var angle = this.state.angle;

    if (angle <= 20) {
      return 1;
    }
    else if (angle <= 30){
      return 1.25;
    }
    else if (angle <= 40) {
      return 1.25 * ( -angle / 30 + 2 );
    }
    else if (angle <= 60) {
      return -angle / 30 + 2;
    }
    else {
      return 0;
    }
  },
  getRoofWeight: function() {
    var roofWeight = 0;
    roofWeight += Number(this.state.roofStructureTopLayerWeight);
    roofWeight += Number(this.state.roofStructureCoreLayerWeight);
    roofWeight += Number(this.state.roofStructureBottomLayerWeight);
    return roofWeight;
  },
  render: function () {
    const COL_3_CELL = 'text-center';
    var
      setRoofLayerNodes,
      roofTopLayerNodes, roofCoreLayerNodes, roofBottomLayerNodes,

      regionNodes = [],

      lang = {
        air_space: 'воздушное пространство',
        asphalt_shingles: 'гибкая черепица',
        gypsum_ceiling_9mm: 'гипрок 1 х 9.5мм по рейке 30мм',
        insulated_200_37kgm: 'утеплитель 200мм (37 кг/м3)',
        insulated_250_37kgm: 'утеплитель 250мм (37 кг/м3)',
        insulated_300_37kgm: 'утеплитель 300мм (37 кг/м3)',
        metal_shingles: 'металлочерепица',
        none: 'нет',
        wooden_ceiling_12mm: 'вагонка 12.5мм (хвоя) по рейке 30мм',
        wooden_ceiling_20mm: 'доска 20мм (хвоя) по стропилам'
      },

      snowRegions = {
        I: 80,
        II: 120,
        III: 180,
        IV: 240,
        V: 320,
        VI: 400,
        VII: 480,
        VIII: 560
      },

      roofStructureTopLayer = {
        asphalt_shingles: 4.5 + 7.8 + 8.5,
        metal_shingles: 5.0 + 3.5
      },

      roofStructureCoreLayer = {
        air_space: 0,
        insulated_200_37kgm: 7.4,
        insulated_250_37kgm: 9.25,
        insulated_300_37kgm: 11.3
      },

      roofStructureBottomLayer = {
        none: 0,
        gypsum_ceiling_9mm: 8,
        wooden_ceiling_12mm: 6.2,
        wooden_ceiling_20mm: 12
      };

    setRoofLayerNodes = function(layerSet) {
      var arr = [];
      for (let layer in layerSet) {
        arr.push(
          <option
            key={layer}
            value={layerSet[layer]}>
            {lang[layer]}
          </option>
        );
      }
      return arr;
    };

    for (let region in snowRegions) {
      regionNodes.push(
        <option
          key={region}
          value={snowRegions[region]}>
          {region}
        </option>
      );
    }

    roofTopLayerNodes = setRoofLayerNodes(roofStructureTopLayer);
    roofCoreLayerNodes = setRoofLayerNodes(roofStructureCoreLayer);
    roofBottomLayerNodes = setRoofLayerNodes(roofStructureBottomLayer);

    return (
      <div>
        <table className="table">
          <caption><h3>Расчет нагрузки от крыши</h3></caption>
          <tbody>
            <tr>
              <td>Угол наклона ската</td>
              <td>
                <input
                  className="form-control"
                  type="number"
                  step="0.1"
                  placeholder="- задайте угол наклона крыши -"
                  value={this.state.angle}
                  onChange={this.handleAngleChange} />
              </td>
              <td></td>
              <td>градусов</td>
            </tr>
            <tr>
              <td className='success text-center' colSpan='4'>
                cos&nbsp;{this.state.angle}<sup>&deg;</sup>&nbsp;=&nbsp;
                {Math.cos(this.state.angle / (180 / Math.PI)).toFixed(4)}
              </td>
            </tr>
          </tbody>
          <tr>
            <td><h4>Снеговая нагрузка</h4></td>
          </tr>
          <tbody>
            <tr>
              <td>
                Снеговой район
              </td>
              <td>
                <select
                  className="form-control"
                  onChange={this.handleSnowLoadChange}>
                  <option disabled selected>
                    - выберите снеговой район -
                  </option>
                  {regionNodes}
                </select>
              </td>
              <td className={COL_3_CELL}>
                {this.state.snowLoad || '0'}
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;проекции</td>
            </tr>
            <tr className="success">
              <td>
                S<sub>0</sub>&nbsp;=&nbsp;0.7&nbsp;&times;&nbsp;&micro;
                &nbsp;&times;&nbsp;S<sub>g</sub>
              </td>
              <td>
                S<sub>0</sub>&nbsp;=&nbsp;0.7&nbsp;&times;&nbsp;
                {this.getMu().toFixed(2)}&nbsp;&times;&nbsp;
                {this.state.snowLoad || '0'}&nbsp;=&nbsp;
                {(0.7*this.state.snowLoad*this.getMu()).toFixed(2)}
              </td>
              <td className={COL_3_CELL}>
                <strong>
                  {(0.7*this.state.snowLoad*this.getMu()).toFixed(2)}
                </strong>
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;проекции</td>
            </tr>
            <tr className="success">
              <td colSpan='2'>С учетом коэффициента надежности = 1.4</td>
              <td className={COL_3_CELL}>
                <strong>
                  {(0.7*this.state.snowLoad*this.getMu()*1.4).toFixed(2)}
                </strong>
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;проекции</td>
            </tr>
          </tbody>

          <tr>
            <td colSpan='4'><h4>Конструкции крыши</h4></td>
          </tr>

          <tbody>

            <tr>
              <td>Кровля</td>
              <td>
                <select
                  className="form-control"
                  name="roofStructureTopLayer"
                  onChange={this.handleRoofStructureChange}>
                  <option disabled selected>- выберите кровлю -</option>
                  {roofTopLayerNodes}
                </select>
              </td>
              <td className={COL_3_CELL}>
                {this.state.roofStructureTopLayerWeight}
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;конструкции</td>
            </tr>

            <tr>
              <td>Ядро<sup>*</sup></td>
              <td>
                <select
                  className="form-control"
                  name="roofStructureCoreLayer"
                  onChange={this.handleRoofStructureChange}>
                  <option disabled selected>- выберите ядро крыши -</option>
                  {roofCoreLayerNodes}
                </select>
              </td>
              <td className={COL_3_CELL}>
                {this.state.roofStructureCoreLayerWeight}
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;конструкции</td>
            </tr>

            <tr>
              <td>Нижний слой</td>
              <td>
                <select
                  className="form-control"
                  name="roofStructureBottomLayer"
                  onChange={this.handleRoofStructureChange}>
                  <option disabled selected>- выберите нижний слой -</option>
                  {roofBottomLayerNodes}
                </select>
              </td>
              <td className={COL_3_CELL}>
                {this.state.roofStructureBottomLayerWeight}
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;конструкции</td>
            </tr>

            <tr>
              <td colSpan='2'>
                Вес конструкций крыши
              </td>
              <td className={COL_3_CELL}>
                {this.getRoofWeight().toFixed(2)}
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;конструкции</td>
            </tr>

            <tr className="success">
              <td colSpan='2'></td>
              <td className={COL_3_CELL}>
                <strong>
                  {(this.getRoofWeight() /
                    Math.cos(this.state.angle / (180 / Math.PI))).toFixed(2)}
                </strong>
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;проекции</td>
            </tr>
            <tr className="success">
              <td colSpan='2'>С учетом коэффициент надежности = 1.1</td>
              <td className={COL_3_CELL}>
                <strong>
                  {(this.getRoofWeight() /
                    Math.cos(this.state.angle / (180 / Math.PI))*1.1)
                    .toFixed(2)}
                </strong>
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;проекции</td>
            </tr>
          </tbody>
          <em className="text-info">(*) Вес стропил в ядро не включён</em>

          <tr>
            <td colSpan="4"><h4>Общая нагрузка</h4></td>
          </tr>

          <tbody>
            <tr className="info">
              <td colSpan="2">Нормативная</td>
              <td
                className={COL_3_CELL}>
                <strong>
                  {
                    (
                      0.7*this.state.snowLoad*this.getMu()
                    + this.getRoofWeight() /
                         Math.cos(this.state.angle / (180 / Math.PI))
                    ).toFixed(2)
                  }
                </strong>
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;проекции</td>
            </tr>
            <tr className="info">
              <td colSpan="2">Расчетная</td>
              <td
                className={COL_3_CELL}>
                <strong>
                  {
                    (
                      0.7*this.state.snowLoad*this.getMu()*1.4
                    + this.getRoofWeight() /
                         Math.cos(this.state.angle / (180 / Math.PI))*1.1
                    ).toFixed(2)
                  }
                </strong>
              </td>
              <td>кг&nbsp;/&nbsp;м<sup>2</sup>&nbsp;проекции</td>
            </tr>
            <tr>
              <td>Шаг стропил</td>
              <td>
                <input
                  className="form-control"
                  type="number"
                  placeholder=" - задайте шаг стропил - "
                  value={this.state.raftersSpacing}
                  onChange={this.handleRaftersSpacing}
                   />
              </td>
              <td></td>
              <td>мм</td>
            </tr>
            <tr>
              <td colSpan="2">Q<sub>н</sub></td>
              <td className={COL_3_CELL}>
                <strong>
                  {
                    (
                      (
                        0.7*this.state.snowLoad*this.getMu()
                        + this.getRoofWeight() /
                          Math.cos(this.state.angle / (180 / Math.PI))
                        ) * (this.state.raftersSpacing / 1000)
                    ).toFixed(2)
                  }
                </strong>
              </td>
              <td>кгс &times; см</td>
            </tr>
            <tr>
              <td colSpan="2">Q<sub>расч</sub></td>
              <td className={COL_3_CELL}>
                <strong>
                  {
                    (
                      (
                        0.7*this.state.snowLoad*this.getMu()*1.4
                        + this.getRoofWeight() /
                          Math.cos(this.state.angle / (180 / Math.PI))*1.1
                        ) * (this.state.raftersSpacing / 1000)
                    ).toFixed(2)
                  }
                </strong>
              </td>
              <td>кгс &times; см</td>
            </tr>
          </tbody>

        </table>

      </div>
    );
  }
});
