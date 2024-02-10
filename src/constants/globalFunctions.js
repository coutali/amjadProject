function financial(x) {
  if (x === null || x === undefined) return "0";

  return Number.parseFloat(x.toString()).toFixed(2);
}

export function formatNumberWithSeparator(number) {
  if (!number) {
    return 0;
  } else {
    return Number(financial(number)).toLocaleString("en-US");
  }
}
