const TIME_ZONE = "Asia/Bangkok";
const NEAR_DUE_DAYS = 3;

function getDayKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value: partValue }) => [type, partValue])
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function dayNumber(dayKey) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

export function getBorrowDueInfo(borrow, now = new Date()) {
  if (borrow.isReturned || borrow.status === "RETURNED") {
    return { status: "RETURNED", daysRemaining: null };
  }
  if (borrow.status === "LOST") {
    return { status: "LOST", daysRemaining: null };
  }

  const dueDay = getDayKey(borrow.dueDate);
  const today = getDayKey(now);
  if (!dueDay || !today) {
    return { status: "UNKNOWN", daysRemaining: null };
  }

  const daysRemaining = dayNumber(dueDay) - dayNumber(today);
  if (daysRemaining < 0) {
    return { status: "OVERDUE", daysRemaining };
  }
  if (daysRemaining === 0) {
    return { status: "DUE_TODAY", daysRemaining };
  }
  if (daysRemaining <= NEAR_DUE_DAYS) {
    return { status: "DUE_SOON", daysRemaining };
  }
  return { status: "UPCOMING", daysRemaining };
}

const urgencyOrder = {
  OVERDUE: 0,
  DUE_TODAY: 1,
  DUE_SOON: 2,
  UPCOMING: 3,
  UNKNOWN: 4,
  LOST: 5,
  RETURNED: 6,
};

export function sortBorrowRecordsByDueDate(borrows, now = new Date()) {
  return [...borrows].sort((a, b) => {
    const aInfo = getBorrowDueInfo(a, now);
    const bInfo = getBorrowDueInfo(b, now);
    const urgencyDifference =
      urgencyOrder[aInfo.status] - urgencyOrder[bInfo.status];

    if (urgencyDifference !== 0) return urgencyDifference;

    const aDueDate = new Date(a.dueDate).getTime();
    const bDueDate = new Date(b.dueDate).getTime();
    if (Number.isNaN(aDueDate)) return Number.isNaN(bDueDate) ? 0 : 1;
    if (Number.isNaN(bDueDate)) return -1;
    return aDueDate - bDueDate;
  });
}
