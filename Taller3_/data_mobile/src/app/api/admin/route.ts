import { adminController } from "@/modules/admin/admin.controller";

// GET /api/admin
export async function GET() {
  return await adminController.getAdmins();
}
