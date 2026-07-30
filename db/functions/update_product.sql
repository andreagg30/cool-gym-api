CREATE OR REPLACE FUNCTION update_product(
    p_current_product_id VARCHAR,
    p_name VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_expiration_date DATE DEFAULT NULL,
    p_new_product_id VARCHAR DEFAULT NULL
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
    UPDATE products AS p
    SET
        name = COALESCE(TRIM(p_name), p.name),
        description = COALESCE(p_description, p.description),
        expiration_date = COALESCE(p_expiration_date, p.expiration_date),
        product_id = COALESCE(TRIM(p_new_product_id), p.product_id)
    WHERE p.product_id = TRIM(p_current_product_id)
    RETURNING
        p.id,
        p.name,
        p.description,
        p.expiration_date,
        p.product_id,
        p.created_at,
        p.updated_at;
$$;
