-- GET USER BY EMAIL
CREATE OR REPLACE FUNCTION user_exists_by_email(
    p_email VARCHAR
)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM users u
        WHERE LOWER(u.email) = LOWER(TRIM(p_email))
    );
$$;
