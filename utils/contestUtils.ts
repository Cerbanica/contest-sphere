export const formatDateManual = (date1: string | number | Date, date2: string | number | Date) => {
    let startDate;
    const endDate = new Date(date2);
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
        'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];
    if (date1 != null) {
        startDate = new Date(date1);

        const month1 = months[startDate.getMonth()];
        const day1 = startDate.getDate();
        const year1 = startDate.getFullYear();
        const month2 = months[endDate.getMonth()];
        const day2 = endDate.getDate();
        const year2 = endDate.getFullYear();

        const formattedYear1 = year1 === year2 ? '' : year1;

        return ` ${day1} ${month1} ${formattedYear1} - ${day2} ${month2} ${year2} `;
    } else {

        const month2 = months[endDate.getMonth()];
        const day2 = endDate.getDate();
        const year2 = endDate.getFullYear();

        return `Ends ${day2} ${month2} ${year2} `;

    }
}

export const formatEntry = (fee: string) => {
    if (fee == "Free" || fee == null) {
        return "Free"
    }
    else {
        return fee;
    }

}

export const calculateDaysRemaining = (deadline: string | Date) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    // Calculate the difference in milliseconds
    const diffInMs = deadlineDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    

    return diffInDays > 0 ? diffInDays : -1; // Return 0 if the deadline has passed
};