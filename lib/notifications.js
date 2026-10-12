/**
 * Helper functions สำหรับสร้าง in-app notifications
 */

/**
 * สร้าง notification ในระบบสำหรับผู้ใช้
 * @param {object} db - Prisma client instance
 * @param {object} data - { userId, title, message, link }
 */
export async function createNotification(db, { userId, title, message, link }) {
  try {
    await db.notification.create({
      data: { userId, title, message: message || null, link: link || null },
    });
  } catch (error) {
    // ไม่ให้ notification error หยุดการทำงานหลัก
    console.error("Failed to create notification:", error);
  }
}
