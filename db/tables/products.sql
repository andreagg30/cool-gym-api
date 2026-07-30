CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    expiration_date DATE NOT NULL,
    product_id VARCHAR(50) NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_products_name_not_blank
        CHECK (BTRIM(name) <> ''),
    CONSTRAINT chk_products_product_id_not_blank
        CHECK (BTRIM(product_id) <> '')
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
