CREATE TABLE meals (
    meal_id VARCHAR(10) PRIMARY KEY,
    meal_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    area VARCHAR(100),
    instructions TEXT,
    thumbnail_url VARCHAR(255),
    youtube_url VARCHAR(255)
);

CREATE INDEX idx_meal_name ON meals (meal_name);
CREATE INDEX idx_meal_category ON meals (category);


CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(150) UNIQUE NOT NULL
);

CREATE UNIQUE INDEX idx_ingredient_name_unique ON ingredients (ingredient_name);


CREATE TABLE meal_ingredients (
    meal_ingredient_id SERIAL PRIMARY KEY,
    meal_id VARCHAR(10) NOT NULL,
    ingredient_id INTEGER NOT NULL,
    measure VARCHAR(150),
    FOREIGN KEY (meal_id) REFERENCES meals (meal_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (ingredient_id) ON DELETE RESTRICT,
    UNIQUE (meal_id, ingredient_id)
);