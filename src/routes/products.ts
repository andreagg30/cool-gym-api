import { Router } from "express";
import productController from "../controllers/products.js";
import { requireAuth } from "../middlewares/require-auth.js";
import {
  createProductValidator,
  productIdParamValidator,
  updateProductValidator,
} from "../validators/products.js";
import { validateRequest } from "../validators/validateRequest.js";

const router = Router();

router.get("/", productController.getProducts);
router.get(
  "/:productId",
  productIdParamValidator,
  validateRequest,
  productController.getProductByProductId,
);
router.post(
  "/",
  requireAuth,
  createProductValidator,
  validateRequest,
  productController.createProduct,
);
router.patch(
  "/:productId",
  requireAuth,
  productIdParamValidator,
  updateProductValidator,
  validateRequest,
  productController.updateProduct,
);
router.delete(
  "/:productId",
  requireAuth,
  productIdParamValidator,
  validateRequest,
  productController.deleteProduct,
);

export default router;
