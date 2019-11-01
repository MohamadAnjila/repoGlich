create table if not exists lists(
  id integer primary key,
  name text not null
);

insert or replace into lists(id,name) values(1, "Groceries");
insert or replace into lists(id,name) values(2, "To the moon!");

create table if not exists items(
  id integer primary key,
  listId integer not null,
  name text not null,
  priority int not null default 1, /* 0=low 1=medium 2=high */
  checked int not null default 0 /* 0=false 1=true */
);

insert or replace into items(listId,id,name,priority) values(1, 1, "Milk", 2);
insert or replace into items(listId,id,name,priority) values(1, 2, "Sugar", 1);

insert or replace into items(listId,id,name,priority) values(2, 3, "Build a rocket", 0);
insert or replace into items(listId,id,name,priority) values(2, 4, "Bring some groceries", 1);
