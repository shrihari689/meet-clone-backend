const getIST = (date = new Date()) => {
    const currentOffset = date.getTimezoneOffset();
    const ISTOffset = 330;
    const ISTTime = new Date(date.getTime() + (ISTOffset + currentOffset) * 60000);
    return ISTTime;
}

const getDateTimeString = (date = getIST()) => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    let dateString = "";
    dateString += date.getDate() + " ";
    dateString += months[date.getMonth()] + " ";
    dateString += date.getFullYear();

    let timeString = "";

    if (date.getHours() === 0) {
        timeString += "12:";
    } else {
        timeString += date.getHours() < 10 ? "0" : "";
        timeString +=
            (date.getHours() > 12
                ? date.getHours() - 12 < 10
                    ? "0" + (date.getHours() - 12)
                    : date.getHours() - 12
                : date.getHours()) + ":";
    }
    timeString +=
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    timeString += date.getHours() > 11 ? " PM" : " AM";
    return { date: dateString, time: timeString };
};

module.exports = { getDateTimeString }