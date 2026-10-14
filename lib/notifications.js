/**
 * Helper functions สำหรับสร้าง in-app notifications
 */

/**
 * สร้าง notification ในระบบสำหรับผู้ใช้รายคน
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

/**
 * ส่ง notification ไปยังบัญชีแอดมินทุกคนในระบบ (Admin Broadcast)
 * @param {object} db - Prisma client instance
 * @param {object} data - { title, message, link }
 */
export async function notifyAdmins(db, { title, message, link }) {
  try {
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (admins && admins.length > 0) {
      const notificationsData = admins.map((admin) => ({
        userId: admin.id,
        title,
        message: message || null,
        link: link || null,
      }));

      await db.notification.createMany({
        data: notificationsData,
      });
    }
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
}
