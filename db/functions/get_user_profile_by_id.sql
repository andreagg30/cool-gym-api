--- USER BY ID

CREATE OR REPLACE FUNCTION get_user_profile_by_id(
    p_user_id UUID
)
RETURNS TABLE (
    id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    birth_date DATE,
    curp CHAR(18),
    gender VARCHAR,
    accepts_communications BOOLEAN,
    user_type_id INTEGER,
    email_verified BOOLEAN,
    is_active BOOLEAN
)
LANGUAGE sql
AS $$
    SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.birth_date,
        u.curp,
        u.gender,
        u.accepts_communications,
		u.user_type_id,
		u.email_verified,
		u.is_active
    FROM users u
    WHERE u.id = p_user_id
      AND u.is_active = TRUE
    LIMIT 1;
$$;