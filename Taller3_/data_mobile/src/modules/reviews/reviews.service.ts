import { reviewRepository } from "./reviews.repository";
import { Prisma } from "@prisma/client";

export const reviewService = {
  async getReviewsByProduct(id_producto: number) {
    return await reviewRepository.findManyByProduct(id_producto);
  },

  async getReview(id_producto: number, fecha: Date) {
    const review = await reviewRepository.findById(id_producto, fecha);
    if (!review) throw new Error("Reseña no encontrada");
    return review;
  },

  async createReview(data: Prisma.ReseñaProductoCreateInput) {
    return await reviewRepository.create(data);
  },

  async updateReview(id_producto: number, fecha: Date, data: Prisma.ReseñaProductoUpdateInput) {
    const existing = await reviewRepository.findById(id_producto, fecha);
    if (!existing) throw new Error("Reseña no encontrada");
    return await reviewRepository.update(id_producto, fecha, data);
  },

  async deleteReview(id_producto: number, fecha: Date) {
    const existing = await reviewRepository.findById(id_producto, fecha);
    if (!existing) throw new Error("Reseña no encontrada");
    return await reviewRepository.delete(id_producto, fecha);
  },
};
