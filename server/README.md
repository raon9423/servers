npx sequelize-cli model:generate --name ProductImage --attributes product_id:integer,image_url:text
npx sequelize-cli model:generate --name Cart --attributes session_id:string,user_id:integer
npx sequelize-cli model:generate --name CartItem --attributes cart_id:integer,product_id:integer,quantity:integer
npx sequelize-cli migration:generate --name new_details
npx sequelize-cli migration:generate --name product_images
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli model:generate --name Attribute --attributes name:string
npx sequelize-cli model:generate --name ProductAttribute --attributes product_id:integer,attribute_id:integer,value:text

npm install express body-parser crypto querystring --legacy-peer-deps

rm -rf .git
git init
git remote add origin https://github.com/raon9423/Raonus.git
git add .
git commit -m "Initial commit"
git push -u origin master

ALTER TABLE `product_images` DROP COLUMN `createdAt`;

INSERT INTO `product_images` (`id`, `product_id`, `image_url`) 
VALUES (DEFAULT, 22, "http://localhost:3000/api/1729762736034-ttttt.png");

Table carts {
    id int [pk]
    session_id varchar [note: 'Để xác định người dùng khách']
    user_id int [null]
}
Table cart_items {
    id int [pk]
    cart_id int
    product_id int
    quantity int
}

update orders session_id varchar [null]
npx sequelize-cli migration:generate --name add_session_to_orders

SELECT * FROM information_schema.table_constraints
WHERE table_schema = 'shop_raonus' AND table_name = 'orders'

ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;

ALTER TABLE orders
ADD COLUMN phone VARCHAR(50),
ADD COLUMN address TEXT;

UPDATE users SET role = 2 WHERE id = 13;

ALTER TABLE users ADD COLUMN password_changed_at DATETIME NULL;|