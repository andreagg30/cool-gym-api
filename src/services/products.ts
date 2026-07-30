import { pool } from "../database/db-connection.js";

export type ProductInput = {
  name: string;
  description: string;
  expiration_date: string;
  productId: string;
};

type ProductRow = Omit<ProductInput, "productId"> & {
  id: string;
  product_id: string;
  created_at: Date;
  updated_at: Date;
};

function mapProduct(product: ProductRow | undefined) {
  if (!product) return undefined;

  const { product_id, ...rest } = product;
  return { ...rest, productId: product_id };
}

async function createProduct(product: ProductInput) {
  const result = await pool.query(
    `SELECT * FROM add_product($1::varchar, $2::text, $3::date, $4::varchar)`,
    [
      product.name,
      product.description,
      product.expiration_date,
      product.productId,
    ],
  );

  return mapProduct(result.rows[0] as ProductRow | undefined);
}

async function getProducts() {
  const result = await pool.query(`SELECT * FROM get_products()`);

  return (result.rows as ProductRow[]).map((product) => mapProduct(product));
}

async function getProductByProductId(productId: string) {
  const result = await pool.query(
    `SELECT * FROM get_product_by_product_id($1::varchar)`,
    [productId],
  );

  return mapProduct(result.rows[0] as ProductRow | undefined);
}

async function updateProduct(
  productId: string,
  product: Partial<ProductInput>,
) {
  const result = await pool.query(
    `SELECT * FROM update_product(
       $1::varchar,
       $2::varchar,
       $3::text,
       $4::date,
       $5::varchar
     )`,
    [
      productId,
      product.name ?? null,
      product.description ?? null,
      product.expiration_date ?? null,
      product.productId ?? null,
    ],
  );

  return mapProduct(result.rows[0] as ProductRow | undefined);
}

async function deleteProduct(productId: string) {
  const result = await pool.query(`SELECT * FROM delete_product($1::varchar)`, [
    productId,
  ]);

  return mapProduct(result.rows[0] as ProductRow | undefined);
}

export default {
  createProduct,
  deleteProduct,
  getProductByProductId,
  getProducts,
  updateProduct,
};
