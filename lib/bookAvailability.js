export function getBookAvailabilityStatus(remaining) {
  return Number(remaining) > 0 ? "AVAILABLE" : "UNAVAILABLE";
}

export async function syncBookAvailabilityStatus(transaction, bookId) {
  const book = await transaction.book.findUnique({
    where: { id: bookId },
    select: { remaining: true },
  });

  if (!book) {
    throw new Error(`Cannot sync availability for missing book ${bookId}`);
  }

  return transaction.book.update({
    where: { id: bookId },
    data: {
      availabilityStatus: getBookAvailabilityStatus(book.remaining),
    },
  });
}
