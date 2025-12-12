import { adminService } from "./admin.service";

export const adminController = {
  async getAdmins() {
    const data = await adminService.getAdmins();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};
