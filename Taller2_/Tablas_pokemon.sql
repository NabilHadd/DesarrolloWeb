CREATE TABLE pokemon (
    id      INT PRIMARY KEY,
    name    VARCHAR(200) NOT NULL,
    height  NUMERIC(10,2),
    weight  NUMERIC(10,2),
    sprite  VARCHAR(200) NOT NULL
);

CREATE TABLE ability (
    id      INT PRIMARY KEY,
    name    VARCHAR(200) NOT NULL,
    effect  VARCHAR(200) NOT NULL
);

CREATE TABLE type (
    id      INT PRIMARY KEY,
    name    VARCHAR(200) NOT NULL,
    sprite  VARCHAR(200)
);

CREATE TABLE pokemon_type (
    id_type     INT NOT NULL,
    id_pokemon  INT NOT NULL,
    PRIMARY KEY (id_pokemon, id_type),
    FOREIGN KEY (id_type) REFERENCES type(id),
    FOREIGN KEY (id_pokemon) REFERENCES pokemon(id)
);

CREATE TABLE pokemon_ability (
    id_ability  INT NOT NULL,
    id_pokemon  INT NOT NULL,
    PRIMARY KEY (id_pokemon, id_ability),
    FOREIGN KEY (id_ability) REFERENCES ability(id),
    FOREIGN KEY (id_pokemon) REFERENCES pokemon(id)
);
