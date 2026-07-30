CREATE OR REPLACE FUNCTION add_product(
    p_name VARCHAR,
    p_description TEXT,
    p_expiration_date DATE,
    p_product_id VARCHAR
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    expiration_date DATE,
    product_id VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE sql
AS $$
    INSERT INTO products (
        name,
        description,
        expiration_date,
        product_id
    )
    VALUES (
        TRIM(p_name),
        p_description,
        p_expiration_date,
        TRIM(p_product_id)
    )
    RETURNING
        products.id,
        products.name,
        products.description,
        products.expiration_date,
        products.product_id,
        products.created_at,
        products.updated_at;
$$;
