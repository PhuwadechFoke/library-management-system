export function canReserveBook(book) {
  if (!book) return false;
  return Boolean(book.active && book.remaining > 0);
}
