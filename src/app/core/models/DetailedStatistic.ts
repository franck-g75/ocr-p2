//for the detailed page graphic
//ngx-charts-line-chart need this kind of structure
import {Statistic}  from './Statistic';
export interface DetailedStatistic {
   name: string;
   series: Statistic[];
}