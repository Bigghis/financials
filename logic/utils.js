export const toDecimal = (percentString) => {
    //checkNumber(percentString)
    return parseFloat(percentString) / 100;
}

export const toPercent = (num, dec=0) => {
    return `${(num * 100).toFixed(dec)}%`;
}

export const formatCurrency = (num, dec=2, symbol='$') => {
    return `${(num).toFixed(dec)}${symbol}`;
}

export const formatNumber = (num, dec=2) => {
    return `${(num).toFixed(dec)}`;
}

export const getYear = (isoStringDate) => {
    const _date = new Date(isoStringDate);
    return _date.getFullYear();
}

export const formatArrayString = (arr) => {
    return arr.join(", ")
}
