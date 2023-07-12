import { StatisticsType } from '../components/common/Statistics';
import Employee from '../model/Product';
import { count } from '../util/number-functions';

export function getStatistics(employees: Employee[], type: string, interval: number): StatisticsType {
    
    return distribution(count(employees, type, interval), interval);
}

function distribution(countsObj: any, interval: number): StatisticsType {
    return Object.entries(countsObj).map((e) => ({
        min: +e[0] * interval,
        max: +e[0] * interval + interval - 1,
        amount: e[1] as number,
        id: e[0],
    }));
}
