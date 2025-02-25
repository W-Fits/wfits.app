CREATE TABLE colour_tag(
    colour_id SERIAL PRIMARY KEY,
    colour_name VARCHAR(35) NOT NULL UNIQUE,
    colour_value CHAR(7) NOT NULL UNIQUE
);

CREATE TABLE catagory_tag(
    catagory_id SERIAL PRIMARY KEY,
    catagory_name VARCHAR(35) NOT NULL UNIQUE
);

CREATE TABLE size_tag(
    size_id SERIAL PRIMARY KEY,
    size_name VARCHAR(35) NOT NULL UNIQUE
);

CREATE TYPE enviroment_num AS ENUM ('Warm', 'Cold');

CREATE TABLE item(
    item_id SERIAL PRIMARY KEY,
    colour_id INT NOT NULL,
    catagory_id INT NOT NULL,
    size_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    item_url TEXT NOT NULL,
    waterproof BOOLEAN,
    avalable BOOLEAN,
    slot INT NOT NULL,
    enviroment ENUM,
    FOREIGN KEY(colour_id) colour_tag(colour_id),
    FOREIGN KEY(size_id) size_tag(size_id),
    FOREIGN KEY(catagory_id) catagory_tag(catagory_id)
);

CREATE TABLE language(
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR(30)
);

CREATE TYPE temp_num AS ENUM ('C', 'F');

CREATE TYPE theme_num AS ENUM ('L', 'D');

CREATE TABLE user(
    user_id SERIAL PRIMARY KEY,
    language_id INT NOT NULL,
    username VARCHAR(60) NOT NULL,
    password TEXT,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(150) NOT NULL,
    set_temp temp_num DEFAULT('C'),
    set_theme theme_num DEFAULT('L'),
    FOREIGN KEY(language_id) language(language_id)
);


CREATE TABLE outfit(
    outfit_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    createdat DATE NOT NULL,
    FOREIGN KEY(user_id) user(user_id)
);

CREATE TABLE outfit_item (
    outfit_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (outfit_id) REFERENCES outfit(outfit_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);