/** @jsx React.DOM */
/* 
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
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
var bows = require('bows');
var React = require('react');
var cx = require('react/lib/cx');

var tideline = {
  log: bows('Footer')
};

var TidelineFooter = React.createClass({
  propTypes: {
    activeDays: React.PropTypes.object,
    chartType: React.PropTypes.string.isRequired,
    onClickLines: React.PropTypes.func,
    onClickValues: React.PropTypes.func,
    showingValues: React.PropTypes.bool
  },
  DAY_ABBREVS: {
    monday: 'M',
    tuesday: 'T',
    wednesday: 'W',
    thursday: 'Th',
    friday: 'F',
    saturday: 'S',
    sunday: 'Su'
  },
  render: function() {
    var valuesLinkClass = cx({
      'tidelineNavLabel': true,
      'tidelineNavRightLabel': true
    });

    var linesLinkClass = cx({
      'tidelineNavLabel': true,
      'tidelineNavRightLabel': true
    });

    function getValuesLinkText(props) {
      if (props.chartType === 'weekly') {
        if (props.showingValues) {
          return 'Hide Values';
        }
        else {
          return 'Show Values';
        }
      }
      else {
        return '';
      }
    }

    function getLinesLinkText(props) {
      if (props.chartType === 'modal') {
        if (props.showingLines) {
          return 'Hide Lines';
        }
        else {
          return 'Show Lines';
        }
      }
      else {
        return '';
      }
    }

    var dayFilters = this.props.chartType === 'modal' ? this.renderDayFilters() : null;

    var valuesLinkText = getValuesLinkText(this.props);

    /* jshint ignore:start */
    var showValues = (
      <a className={valuesLinkClass} onClick={this.props.onClickValues}>{valuesLinkText}</a>
      );
    /* jshint ignore:end */

    var linesLinkText = getLinesLinkText(this.props);

    /* jshint ignore:start */
    var modalOpts = (
      <a className={linesLinkClass} onClick={this.props.onClickLines}>{linesLinkText}</a>
      );
    /* jshint ignore:end */

    /* jshint ignore:start */
    var rightSide = this.props.chartType === 'weekly' ? showValues :
      this.props.chartType === 'modal' ? modalOpts : null;
    /* jshint ignore:end */

    /* jshint ignore:start */
    return (
      <div className="tidelineNav grid">
        <div className="grid-item one-half">{dayFilters}</div>
        <div className="grid-item one-half">{rightSide}</div>
      </div>
      );
    /* jshint ignore:end */
  },
  renderDayFilters: function() {
    var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    var dayLinks = [];
    for (var i = 0; i < days.length; ++i) {
      dayLinks.push(this.renderDay(days[i]));
    }
    /* jshint ignore:start */
    return (
      <div className="dayFilters">
        {dayLinks}
      </div>
      );
    /* jshint ignore:end */
  },
  renderDay: function(day) {
    var dayLinkClass = cx({
      'tidelineNavLabel': true,
      'active': this.props.activeDays[day],
      'inactive': !this.props.activeDays[day]
    }) + ' ' + day;
    /* jshint ignore:start */
    return (
      <a className={dayLinkClass} key={day} onClick={this.props.onClickDay(day)}>{this.DAY_ABBREVS[day]}</a>
      );
    /* jshint ignore:end */
  }
});

module.exports = TidelineFooter;
