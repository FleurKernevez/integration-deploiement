CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email VARCHAR(255),
    password VARCHAR(255)
);

-- Insère l'admin seulement s'il n'existe pas déjà
INSERT INTO admin (email, password)
SELECT * FROM (SELECT "loise.fenoll@ynov.com", "PvdrTAzTeR247sDnAZBr") AS tmp
WHERE NOT EXISTS (
    SELECT email FROM admin WHERE email = "loise.fenoll@ynov.com"
) LIMIT 1;