const moment = require('moment');  // Used to handle dates easily

function calculateTotalTarget(startDate, endDate, totalTarget) {
    const start = moment(startDate, 'YYYY-MM-DD');  // Start date of the period
    const end = moment(endDate, 'YYYY-MM-DD');      // End date of the period
    
    let daysExcludingFridays = [];         // List to store the number of days in each month excluding Fridays
    let daysWorkedExcludingFridays = [];   // List to store the number of working days (excluding Fridays) in each month
    let monthlyTargets = [];               // List to store the target for each month
    let totalWorkingDays = 0;              // Total number of working days (excluding Fridays)

    // Loop through each month between the start and end date
    while (start.isBefore(end) || start.isSame(end)) {
        // Determine the start and end of the current month
        let currentMonthStart = moment(start).startOf('month');  // Start of the current month
        let currentMonthEnd = moment(start).endOf('month').isAfter(end) ? moment(end) : moment(start).endOf('month'); // End of the current month
        
        let daysInMonth = 0;           // Counter for the number of non-Friday days in the current month
        let workingDaysInMonth = 0;    // Counter for the number of working days in the current month (excluding Fridays)

        // Loop through each day of the current month
        for (let day = moment(currentMonthStart); day.isBefore(currentMonthEnd) || day.isSame(currentMonthEnd); day.add(1, 'days')) {
            // Check if the day is not Friday (Friday is day 5 in moment.js)
            if (day.day() !== 5) {  
                daysInMonth++;  // Increment the number of non-Friday days in the month
                workingDaysInMonth++;  // Count it as a working day if it's not Friday
            }
        }

        // Add the number of non-Friday days and working days (excluding Fridays) to the lists
        daysExcludingFridays.push(daysInMonth);          
        daysWorkedExcludingFridays.push(workingDaysInMonth);
        totalWorkingDays += workingDaysInMonth;   // Update the total working days (excluding Fridays)

        // Move to the next month
        start.add(1, 'month').startOf('month');
    }

    // Calculate the target for each month based on the number of working days (excluding Fridays)
    daysWorkedExcludingFridays.forEach(days => {
        monthlyTargets.push((totalTarget / totalWorkingDays) * days);
    });

    // Calculate the total target, rounding it to the nearest integer
    const totalResult = monthlyTargets.reduce((acc, value) => acc + value, 0);

    return {
        daysExcludingFridays,           // Number of days in each month excluding Fridays
        daysWorkedExcludingFridays,     // Number of working days in each month excluding Fridays
        monthlyTargets,                 // Target for each month based on working days
        totalTarget: Math.round(totalResult)  // Rounded total target for the entire period
    };
}

// Example usage
console.log(calculateTotalTarget('2024-01-01', '2024-03-31', 5220));