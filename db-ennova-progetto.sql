CREATE TABLE IF NOT EXISTS Genres (
    genre_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (genre_name)
);

CREATE TABLE IF NOT EXISTS Media (
    title VARCHAR(50) NOT NULL,
    publishing_date DATE NOT NULL,
    director_name VARCHAR(50) NOT NULL,
    views_count INT DEFAULT 0,
    is_film BOOLEAN NOT NULL,
    genre VARCHAR(50) NOT NULL,
    media_description VARCHAR(200) NOT NULL,
    actors VARCHAR(200) NOT NULL,
    quality VARCHAR(20) NOT NULL,
    price FLOAT NOT NULL,
    available BOOLEAN DEFAULT true,
    added_date DATE NOT NULL,
    media_image VARCHAR(200) NOT NULL,
    media_url VARCHAR(200) NOT NULL,
    PRIMARY KEY (title, publishing_date),
    FOREIGN KEY (genre) REFERENCES Genres(genre_name)
);

CREATE TABLE IF NOT EXISTS Users (
    nickname VARCHAR(50) NOT NULL,
    user_name VARCHAR(50),
    user_surname VARCHAR(50),
    sign_on_date DATETIME DEFAULT NULL,
    is_completed INT DEFAULT 0,
    PRIMARY KEY (nickname)
);

CREATE TABLE IF NOT EXISTS Favourites (
    user_nickname VARCHAR(50) NOT NULL,
    media_title VARCHAR(50) NOT NULL,
    media_publishing_date DATE NOT NULL,
    PRIMARY KEY (user_nickname, media_title, media_publishing_date),
    FOREIGN KEY (user_nickname) REFERENCES Users(nickname),
    FOREIGN KEY (media_title, media_publishing_date) REFERENCES Media(title, publishing_date)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Episodes (
    num INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(50) NOT NULL,
    media_title VARCHAR(50) NOT NULL,
    media_publishing_date DATE NOT NULL,
    PRIMARY KEY (num, media_title, media_publishing_date),
    FOREIGN KEY (media_title, media_publishing_date) REFERENCES Media(title, publishing_date)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Reviews (
    rating INT NOT NULL,
    comment VARCHAR(140),
    user_nickname VARCHAR(50) NOT NULL,
    media_title VARCHAR(50) NOT NULL,
    media_publishing_date DATE NOT NULL,
    PRIMARY KEY (user_nickname, media_title, media_publishing_date),
    FOREIGN KEY (user_nickname) REFERENCES Users(nickname) ON DELETE CASCADE,
    FOREIGN KEY (media_title, media_publishing_date) REFERENCES Media(title, publishing_date)
);

CREATE TABLE IF NOT EXISTS Purchases (
    purchase_date DATETIME NOT NULL,
    purchase_price FLOAT NOT NULL,
    user_nickname VARCHAR(50) NOT NULL,
    media_title VARCHAR(50) NOT NULL,
    media_publishing_date DATE NOT NULL,
    PRIMARY KEY (user_nickname, media_title, media_publishing_date),
    FOREIGN KEY (user_nickname) REFERENCES Users(nickname),
    FOREIGN KEY (media_title, media_publishing_date) REFERENCES Media(title, publishing_date)
);

CREATE TABLE IF NOT EXISTS GenresUsers (
    genre_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    PRIMARY KEY (genre_name, nickname),
    FOREIGN KEY (genre_name) REFERENCES Genres(genre_name),
    FOREIGN KEY (nickname) REFERENCES Users(nickname)
);