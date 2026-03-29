INSERT INTO orders (customer_name, item_name, quantity, status, created_at)
VALUES
    ('Alice', 'Burger', 2, 'CREATED', NOW()),
    ('Bob', 'Pizza', 1, 'CREATED', NOW())
ON CONFLICT DO NOTHING;
