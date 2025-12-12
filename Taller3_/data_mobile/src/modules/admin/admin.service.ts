import { adminRepository } from "./admin.repository";

export const adminService = {
  async getAdmins() {
    const admins = await adminRepository.findAll();
    // aquí puedes procesar los datos si quieres
    return admins;
  },
};
