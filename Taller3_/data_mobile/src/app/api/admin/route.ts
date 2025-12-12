import { adminController } from "@/modules/admin";

// GET /api/admin
export async function GET() {
  return await adminController.getAdmins();
}
