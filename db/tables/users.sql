CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),

    birth_date DATE NOT NULL,
    curp CHAR(18) NOT NULL UNIQUE,
    gender VARCHAR(10) NOT NULL,
    accepts_communications BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT chk_users_birth_date CHECK (birth_date <= CURRENT_DATE),
    CONSTRAINT chk_users_gender CHECK (gender IN ('male', 'female', 'other')),
    password_hash TEXT NOT NULL,

    user_type_id INTEGER NOT NULL,

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_users_user_type
        FOREIGN KEY (user_type_id)
        REFERENCES catalog(id)
);

ALTER TABLE users
ADD CONSTRAINT uq_users_curp UNIQUE (curp);

ALTER TABLE users
ADD CONSTRAINT chk_users_birth_date CHECK (birth_date <= CURRENT_DATE);

ALTER TABLE users
ADD CONSTRAINT chk_users_gender CHECK (gender IN ('male', 'female', 'other'));


/* CREATE UNIQUE INDEX users_email_lower_unique
ON users (LOWER(email));

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 */
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

