export const LOW_STOCK_THRESHOLD = 5;

export function getBookStockStatus(remaining) {
  if (remaining === null || remaining === undefined || remaining === "") {
    return "unknown";
  }

  const quantity = Number(remaining);
  if (!Number.isFinite(quantity)) {
    return "unknown";
  }

  if (quantity <= 0) {
    return "out";
  }

  return quantity <= LOW_STOCK_THRESHOLD ? "low" : "normal";
}
