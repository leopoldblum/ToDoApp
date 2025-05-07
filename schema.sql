CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	title TEXT not NULL,
	description TEXT not NULL,
	fulfilled BOOLEAN not NULL
	user_id TEXT not NULL,
);