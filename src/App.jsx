import React from 'react';

import LoadRoof from 'components/load_roof';
import BeamSchemes from 'components/beam_schemes';
import BeamSingleSpan from 'components/beam_single_span';
import Profiles from 'components/profiles';
import Materials from 'components/materials';
import Conditions from 'components/conditions';

export default React.createClass({
  displayName: 'App',
  propTypes: {
    model: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      isParamChanged: false
    };
  },
  handleParamChange: function() {
    this.setState({isParamChanged: true});
  },
  render: function () {
    var model = this.props.model;
    return (
      <div className="container">
        <h2>Расчет нагрузки на балку</h2>
        <div className="row">
          <LoadRoof />
        </div>
        <h2>Расчет деревянной балки</h2>
        <div className="row">
          <div className="col-lg-12">
            <BeamSchemes />
          </div>
          <div className="col-lg-8">
            <BeamSingleSpan
              model={model}
              handleParamChange={this.handleParamChange}
            />
          </div>
          <div className="col-lg-4">
            <Profiles
              model={model}
              handleParamChange={this.handleParamChange}
            />
            <Materials />
            <Conditions />
          </div>
        </div>
      </div>
    );
  }
});
