import * as moment from 'moment';

export function checkTodayTomorrow(data: any) {
    let currentDate = new Date();

    let matchDate = data.time;

    var startOfToday = moment(currentDate).startOf('day');
    var startOfDate = moment(matchDate).startOf('day');
    var daysDiff = startOfDate.diff(startOfToday, 'days');

    if (daysDiff < 0) {
        daysDiff = 0;
    }
    return daysDiff;

}