export const toDecimal = (percentString) => {
    //checkNumber(percentString)
    return parseFloat(percentString) / 100;
}

export const toPercent = (num, dec=0) => {
    if (num && num !== 'NA') { 
        return `${(num * 100).toFixed(dec)}%`;
    }
    return '-'
}

export const formatCurrency = (num, dec=2, symbol='$') => {
    if (num && num !== 'NA') { 
        return `${(num).toFixed(dec)}${symbol}`;
    }
    return '-'
}

export const formatNumber = (num, dec=2) => {
    if (num && num !== 'NA') {
        return `${(num).toFixed(dec)}`;
    }
    return '-';
}

export const getYear = (isoStringDate) => {
    const _date = new Date(isoStringDate);
    return _date.getFullYear();
}

export const formatArrayString = (arr) => {
    return arr.join(", ")
}
