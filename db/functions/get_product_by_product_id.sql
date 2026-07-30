CREATE OR REPLACE FUNCTION get_product_by_product_id(
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
    SELECT
        p.id,
        p.name,
        p.description,
        p.expiration_date,
        p.product_id,
        p.created_at,
        p.updated_at
    FROM products p
    WHERE p.product_id = TRIM(p_product_id)
    LIMIT 1;
$$;
