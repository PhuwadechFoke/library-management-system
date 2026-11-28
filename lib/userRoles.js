export const STAFF_ROLES = ["ADMIN", "LIBRARIAN"];

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}
