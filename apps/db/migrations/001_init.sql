CREATE TYPE enviroment_num AS ENUM ('Warm', 'Cold');
CREATE TYPE temp_num AS ENUM ('C', 'F');
CREATE TYPE theme_num AS ENUM ('L', 'D');

CREATE TABLE IF NOT EXISTS colour_tag (
    colour_id SERIAL PRIMARY KEY,
    colour_name VARCHAR(35) NOT NULL UNIQUE,
    colour_value CHAR(7) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS catagory_tag (
    catagory_id SERIAL PRIMARY KEY,
    catagory_name VARCHAR(35) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS size_tag (
    size_id SERIAL PRIMARY KEY,
    size_name VARCHAR(35) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS item (
    item_id SERIAL PRIMARY KEY,
    colour_id INT NOT NULL,
    catagory_id INT NOT NULL,
    size_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    item_url TEXT NOT NULL,
    waterproof BOOLEAN,
    avalable BOOLEAN,
    slot INT NOT NULL,
    enviroment enviroment_num,
    FOREIGN KEY (colour_id) REFERENCES colour_tag(colour_id),
    FOREIGN KEY (size_id) REFERENCES size_tag(size_id),
    FOREIGN KEY (catagory_id) REFERENCES catagory_tag(catagory_id)
);

CREATE TABLE IF NOT EXISTS language (
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    language_id INT NOT NULL,
    username VARCHAR(60) NOT NULL,
    password TEXT,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(150) NOT NULL,
    set_temp temp_num DEFAULT('C'),
    set_theme theme_num DEFAULT('L'),
    FOREIGN KEY (language_id) REFERENCES language(language_id)
);

CREATE TABLE IF NOT EXISTS outfit (
    outfit_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    createdat DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE IF NOT EXISTS outfit_item (
    outfit_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (outfit_id) REFERENCES outfit(outfit_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);