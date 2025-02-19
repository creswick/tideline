/* 
 * == BSD2 LICENSE ==
 * Copyright (c) 2015 Tidepool Project
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 * 
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

// in order to get d3.chart dependency
var tideline = require('../../../js/');

var _ = require('lodash');
var bows = require('bows');
var d3 = require('d3');
var moment = require('moment-timezone');
var React = require('react');

var sundial = require('sundial');

require('./less/basics.less');
var debug = bows('Basics Chart');
var basicsState = require('./logic/state');
var basicsActions = require('./logic/actions');
var dataMungerMkr = require('./logic/datamunger');

var Section = require('./components/DashboardSection');

var dataUrl = 'data/blip-input.json';

var BasicsChart = React.createClass({
  propTypes: {
    bgClasses: React.PropTypes.object.isRequired,
    bgUnits: React.PropTypes.string.isRequired,
    onSelectDay: React.PropTypes.func.isRequired,
    patientData: React.PropTypes.object.isRequired,
    timePrefs: React.PropTypes.object.isRequired,
    updateBasicsData: React.PropTypes.func.isRequired
  },
  _adjustSectionsBasedOnAvailableData: function(basicsData) {
    if (_.isEmpty(basicsData.data.reservoirChange.data)) {
      var siteChangeSection = _.find(basicsData.sections, function(section) {
        return section.type === 'reservoirChange';
      });
      siteChangeSection.active = false;
    }
    if (_.isEmpty(basicsData.data.calibration.data)) {
      var fingerstickSection = _.find(basicsData.sections, function(section) {
        return section.type === 'fingerstick';
      });

      fingerstickSection.selectorOptions.rows.forEach(function(row) {
        var calibrationSelector = _.find(row, function(option) {
          return option.key === 'calibration';
        });
        if (calibrationSelector) {
          calibrationSelector.active = false;
        }
      });
    }
  },
  componentWillMount: function() {
    var basicsData = this.props.patientData.basicsData;
    if (basicsData.sections == null) {
      basicsData = _.assign({}, basicsData, _.cloneDeep(basicsState));
      var dataMunger = dataMungerMkr(this.props.bgClasses);
      dataMunger.reduceByDay(basicsData);
      basicsData.data.reservoirChange.infusionSiteHistory = dataMunger.infusionSiteHistory(basicsData);
      basicsData.data.bgDistribution = dataMunger.bgDistribution(basicsData);
      var basalBolusStats = dataMunger.calculateBasalBolusStats(basicsData);
      basicsData.data.basalBolusRatio = basalBolusStats.basalBolusRatio;
      basicsData.data.totalDailyDose = basalBolusStats.totalDailyDose;
      this._adjustSectionsBasedOnAvailableData(basicsData);
    }
    this.setState(basicsData);
    basicsActions.bindApp(this);
  },
  componentWillUnmount: function() {
    var patientData = _.clone(this.props.patientData);
    patientData.basicsData = this.state;
    this.props.updateBasicsData(patientData);
  },
  render: function() {
    var leftColumn = this.renderColumn('left');
    var rightColumn = this.renderColumn('right');
    return (
      <div className='Container--flex'>
        <div className='Column Column--left'>
          {leftColumn}
        </div>
        <div className='Column Column--right'>
          {rightColumn}
        </div>
      </div>
    );
  },
  renderColumn: function(columnSide) {
    var self = this;
    var timePrefs = this.props.timePrefs;
    var tz = timePrefs.timezoneAware ? timePrefs.timezoneName : 'UTC';
    var sections = [];
    for (var key in this.state.sections) {
      var section = _.cloneDeep(self.state.sections[key]);
      section.name = key;
      sections.push(section);
    }
    var column = _.sortBy(
      _.where(sections, {column: columnSide}),
      'index'
    );

    return _.map(column, function(section, index) {
      return (
        <Section key={section.name}
          bgClasses={self.props.bgClasses}
          bgUnits={self.props.bgUnits}
          chart={section.chart}
          data={self.state.data}
          days={self.state.days}
          name={section.name}
          onSelectDay={self.props.onSelectDay}
          open={section.open}
          section={section}
          title={section.title}
          timezone={tz} />
      );
    });
  }
});

module.exports = BasicsChart;
