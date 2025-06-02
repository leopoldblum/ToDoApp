CREATE TABLE todos (
	id TEXT PRIMARY KEY,
	title TEXT not NULL,
	description TEXT not NULL,
	fulfilled BOOLEAN not NULL,
	userid TEXT not NULL,
	optimisticid TEXT not NULL
);