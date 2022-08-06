export const toDecimal = (percentString) => {
    return parseFloat(percentString) / 100;
}

export const toPercent = (num) => {
    return `${(num * 100).toFixed(0)}%`;
}

export const getYear = (isoStringDate) => {
    const _date = new Date(isoStringDate);
    return _date.getFullYear();
}

export const formatArrayString = (arr) => {
    return arr.join(", ")
}
