CREATE TABLE indicator (
    code VARCHAR(50) PRIMARY key,
    name VARCHAR(200) NOT NULL,
    unit VARCHAR(50) NOT NULL
);

CREATE TABLE indicator_value (
    indicator_code varchar(50) NOT NULL,
    date DATE NOT NULL,
    value NUMERIC(20,4) NOT NULL,
    PRIMARY key(indicator_code, date),
    foreign key(indicator_code) references indicator(code)
);
