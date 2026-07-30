import type { Request, Response } from "express";
import productService, { type ProductInput } from "../services/products.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

async function createProduct(req: Request, res: Response) {
  try {
    const product = await productService.createProduct(
      req.body as ProductInput,
    );
    return sendSuccess({ res, statusCode: 201, data: { product } });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return sendError({
        res,
        statusCode: 409,
        message: "ProductIdAlreadyExists",
      });
    }
    console.error(error);
    return sendError({ res });
  }
}

async function getProducts(_req: Request, res: Response) {
  try {
    const products = await productService.getProducts();
    return sendSuccess({ res, data: { products } });
  } catch (error) {
    console.error(error);
    return sendError({ res });
  }
}

async function getProductByProductId(req: Request, res: Response) {
  try {
    const product = await productService.getProductByProductId(
      req.params.productId as string,
    );
    if (!product) {
      return sendError({ res, statusCode: 404, message: "ProductNotFound" });
    }
    return sendSuccess({ res, data: { product } });
  } catch (error) {
    console.error(error);
    return sendError({ res });
  }
}

async function updateProduct(req: Request, res: Response) {
  try {
    const product = await productService.updateProduct(
      req.params.productId as string,
      req.body as Partial<ProductInput>,
    );
    if (!product) {
      return sendError({ res, statusCode: 404, message: "ProductNotFound" });
    }
    return sendSuccess({ res, data: { product } });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return sendError({
        res,
        statusCode: 409,
        message: "ProductIdAlreadyExists",
      });
    }
    console.error(error);
    return sendError({ res });
  }
}

async function deleteProduct(req: Request, res: Response) {
  try {
    const product = await productService.deleteProduct(
      req.params.productId as string,
    );
    if (!product) {
      return sendError({ res, statusCode: 404, message: "ProductNotFound" });
    }
    return sendSuccess({ res, data: { product } });
  } catch (error) {
    console.error(error);
    return sendError({ res });
  }
}

export default {
  createProduct,
  deleteProduct,
  getProductByProductId,
  getProducts,
  updateProduct,
};
