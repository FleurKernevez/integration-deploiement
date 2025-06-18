INSERT INTO utilisateur (nom, prenom, email, dateDeNaissance, codePostal, ville)
SELECT * FROM (
    SELECT 'Dupont', 'Jean', 'jean.dupont@example.com', '1980-01-01', '75001', 'Paris'
) AS tmp
WHERE NOT EXISTS (
    SELECT email FROM utilisateur WHERE email = 'jean.dupont@example.com'
) LIMIT 1;