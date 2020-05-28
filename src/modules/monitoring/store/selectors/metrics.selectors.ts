import * as fromModels from '@models/store/selectors';
import { createSelector } from '@ngrx/store';
import { MetricSpecification } from '@shared/models/metric-specification.model';
import { getMetricsState } from '../reducers';
import * as fromMetrics from '../reducers/metrics.reducer';

export const selectAllMetrics = createSelector(
  getMetricsState,
  fromMetrics.selectAllMetrics
);
export const selectAllMetricsEntities = createSelector(
  getMetricsState,
  fromMetrics.selectAllMetricsEntities
);
export const selectAllMetricsIds = createSelector(
  getMetricsState,
  fromMetrics.selectAllMetricsIds
);
export const selectSelectedMetrics = createSelector(
  selectAllMetrics,
  fromModels.selectSelectedModelVersion,
  (metrics, modelVersion) =>
    modelVersion &&
    metrics.filter(metric => metric.modelVersionId === modelVersion.id)
);

export const selectCustomMetrics = createSelector(
  selectSelectedMetrics,
  metrics => {
    return metrics.filter(isCustomMetric);
  }
);

export const selectMetricSpecsNames = createSelector(
  selectAllMetrics,
  metrics => metrics.map(({ name }) => name || 'n/a')
);

const isCustomMetric = (metric: MetricSpecification): boolean => {
  const systemMetrics = new Set([
    'fake-id-error-rate',
    'fake-id-latency',
    'fake-id-counter',
  ]);

  return !systemMetrics.has(metric.id);
};
