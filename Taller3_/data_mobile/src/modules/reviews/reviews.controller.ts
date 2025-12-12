import { reviewService } from "./reviews.service";

export const reviewController = {
  async getReviewsByProduct(id_producto: number) {
    return await reviewService.getReviewsByProduct(id_producto);
  },

  async getReview(id_producto: number, fecha: Date) {
    return await reviewService.getReview(id_producto, fecha);
  },

  async createReview(data: { id_producto: number; valoracion: number; descripcion?: string }) {
    return await reviewService.createReview({
      fecha: new Date(),
      valoracion: data.valoracion,
      descripcion: data.descripcion,
      producto: {
        connect: { id_producto: data.id_producto }, 
      },
    });
  },

  async updateReview(id_producto: number, fecha: Date, data: { valoracion?: number; descripcion?: string }) {
    return await reviewService.updateReview(id_producto, fecha, data);
  },

  async deleteReview(id_producto: number, fecha: Date) {
    return await reviewService.deleteReview(id_producto, fecha);
  },
};
