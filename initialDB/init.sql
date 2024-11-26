-- connect to the database

\connect mistery_dish;

-- create schema mistery_dish;

create schema mistery_dish;

-- verificamos si existe la tabla storage

create table mistery_dish.storage (
    id serial primary key,
    name varchar(100) not null,
    quantity integer not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);
insert into mistery_dish.storage (name, quantity) values ('tomato', 5);
insert into mistery_dish.storage (name, quantity) values ('lemon', 5);
insert into mistery_dish.storage (name, quantity) values ('potato', 5);
insert into mistery_dish.storage (name, quantity) values ('rice', 5);
insert into mistery_dish.storage (name, quantity) values ('ketchup', 5);
insert into mistery_dish.storage (name, quantity) values ('lettuce', 5);
insert into mistery_dish.storage (name, quantity) values ('onion', 5);
insert into mistery_dish.storage (name, quantity) values ('cheese', 5);
insert into mistery_dish.storage (name, quantity) values ('meat', 5);
insert into mistery_dish.storage (name, quantity) values ('chicken', 5);

-- verificamos si existe la tabla dish

create table mistery_dish.dish (
  id serial primary key,
  name varchar(100) not null,
  description text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

insert into mistery_dish.dish (name, description) values ('Ensalada Caprese con un Toque Mediterráneo', 'Un clásico reinventado. Rodajas de tomate fresco, mozzarella fresca o queso feta, hojas de albahaca, aceite de oliva, sal, pimienta y un toque de limón. Para darle un toque mediterráneo, agrega aceitunas negras y piñones.');

insert into mistery_dish.dish (name, description) values ('Arroz a la Valenciana con Pollo', 'Un plato tradicional español. Sofríe cebolla, pimiento rojo y pollo en trozos. Agrega arroz, caldo de pollo, tomate triturado, azafrán y cocínalo hasta que el arroz esté en su punto. Adorna con guisantes y huevo duro.');

insert into mistery_dish.dish (name, description) values ('Hamburguesas Caseras con Salsa Especial', 'Prepara tus propias hamburguesas con carne picada de res y condimenta a tu gusto. Acompaña con lechuga, tomate, cebolla caramelizada y una salsa especial hecha con ketchup, mostaza, mayonesa y pepinillos encurtidos.');

insert into mistery_dish.dish (name, description) values ('Sopa de Tomate y Patata con Croutons', 'Una sopa reconfortante y nutritiva. Sofríe cebolla y ajo, agrega tomate triturado, patatas cortadas en cubos y caldo de pollo. Cocina hasta que las patatas estén blandas. Sirve con croutons de pan de ajo.');

insert into mistery_dish.dish (name, description) values ('Fajitas de Pollo con Verduras:', 'Corta pollo en tiras y saltéalo con pimientos, cebolla y un poco de ajo. Sirve en tortillas de trigo junto con lechuga rallada, queso rallado, guacamole y salsa de yogur con menta.');

insert into mistery_dish.dish (name, description) values ('Risotto de Pollo y Limón', 'Un plato elegante y sabroso. Sofríe cebolla y luego agrega arroz arborio. Vierte caldo de pollo poco a poco, removiendo constantemente. Al final, incorpora pollo desmenuzado y ralladura de limón.');

-- verificamos si existe la tabla dish_ingredient

 create table mistery_dish.dish_ingredient (
  id serial primary key,
  dish_id integer not null,
  ingredient_id integer not null,
  quantity integer not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  constraint fk_dish_ingredient foreign key (dish_id) references mistery_dish.dish(id),
  constraint fk_ingredient_dish foreign key (ingredient_id) references mistery_dish.storage(id)
);

-- Ensalada Caprese con un Toque Mediterráneo
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (1, 1, 2); -- tomato
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (1, 8, 1); -- cheese
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (1, 2, 1); -- lemon
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (1, 6, 1); -- lettuce
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (1, 7, 1); -- onion

-- Arroz a la Valenciana con Pollo
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (2, 4, 1); -- rice
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (2, 9, 1); -- chicken
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (2, 7, 1); -- onion

-- Hamburguesas Caseras con Salsa Especial
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (3, 9, 1); -- meat
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (3, 1, 1); -- tomato
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (3, 6, 1); -- lettuce
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (3, 7, 1); -- onion
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (3, 8, 1); -- cheese
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (3, 5, 1); -- ketchup

-- Sopa de Tomate y Patata con Croutons
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (4, 1, 2); -- tomato
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (4, 3, 2); -- potato
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (4, 5, 1); -- ketchup

-- Fajitas de Pollo con Verduras
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (5, 9, 1); -- chicken
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (5, 1, 1); -- tomato
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (5, 6, 1); -- lettuce
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (5, 7, 1); -- onion

-- Risotto de Pollo y Limón
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (6, 4, 1); -- rice
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (6, 9, 1); -- chicken
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (6, 2, 1); -- lemon
insert into mistery_dish.dish_ingredient (dish_id, ingredient_id, quantity) values (6, 7, 1); -- onion

-- verificamos si existe la tabla order status

create table mistery_dish.order_status (
  id serial primary key,
  name varchar(100) not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);
insert into mistery_dish.order_status (name) values ('pending');
insert into mistery_dish.order_status (name) values ('cooking');
insert into mistery_dish.order_status (name) values ('completed');
insert into mistery_dish.order_status (name) values ('cancelled');
-- verificamos si existe la tabla order

create table mistery_dish.order (
  id serial primary key,
  dish_id integer not null,
  status_id integer not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  constraint fk_dish_order foreign key (dish_id) references mistery_dish.dish(id),
  constraint fk_status_order foreign key (status_id) references mistery_dish.order_status(id)
);

