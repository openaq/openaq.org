import React from 'react';
import { PropTypes as T } from 'prop-types';

import DetailsCard from '../../components/dashboard/details-card';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';

function ProjectDashboard({ projectData, lifecycle, dateRange }) {
  return (
    <div className="inner dashboard-cards">
      <DetailsCard
        measurements={projectData.measurements}
        lifecycle={lifecycle}
        date={{
          start: projectData.firstUpdated,
          end: projectData.lastUpdated,
        }}
      />
      <LatestMeasurementsCard parameters={projectData.parameters} />
      <SourcesCard sources={projectData.sources} />
      <TimeSeriesCard
        projectId={projectData.id}
        parameters={projectData.parameters}
        dateRange={dateRange}
        titleInfo={
          'The average value of a pollutant over time during the specified window at each individual node selected and the average values across all locations selected. While locations have varying time intervals over which they report, all time series charts show data at the same intervals. For one day or one month of data the hourly average is shown. For the project lifetime the daily averages are shown. If all locations are selected only the average across all locations is shown, not the individual location values.'
        }
      />
      <MeasureandsCard
        parameters={projectData.parameters}
        titleInfo={
          "The average of all values and total number of measurements for the available pollutants during the chosen time window and for the selected locations. Keep in mind that not all locations may report the same pollutants. What are we doing when the locations aren't reporting the same pollutants?"
        }
      />
      <TemporalCoverageCard
        parameters={projectData.parameters}
        dateRange={dateRange}
        spatial="project"
        id={projectData.name}
        titleInfo={
          'The average number of measurements for each pollutant by hour, day, or month at the selected locations. In some views a window may be turned off if that view is not applicable to the selected time window.'
        }
      />
    </div>
  );
}

ProjectDashboard.propTypes = {
  projectData: T.object,
  lifecycle: T.array,
  dateRange: T.string,
};

export default ProjectDashboard;
