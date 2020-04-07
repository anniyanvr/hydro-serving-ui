import { ColoringType } from '@core/models';
import { CmpOperators } from '@monitoring/models';

export type LinkRegime = 'all' | 'nearest' | 'counterfactuals';
export interface ClassLabel {
  classes?: Array<number | string>;
  coloring_type: ColoringType;
  data: number[];
}
export interface Metric {
  scores: number[];
  operation: CmpOperators;
  threshold: number;
}
export type TaskState = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface TaskInformation {
  Task_id: string;
  description?: string;
  state: TaskState;
  result: Array<{ result: VisualizationResponse }>;
}
export interface VisualizationResponse {
  data_shape: [number, number];
  data: number[][];
  class_labels: {
    [name: string]: ClassLabel;
  };
  metrics: {
    [name: string]: Metric;
  };
  requests_ids: number[];
  top_100: number[][];
  counterfactuals: number[][],
  visualization_metrics: {
    [name: string]: string;
  };
}
