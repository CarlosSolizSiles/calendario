interface DaysInMonth {
    year:number, month:number,
}
function daysInMonth ({year, month}:DaysInMonth ) {
    return new Date(year, month, 0).getDate();
}

export {daysInMonth}