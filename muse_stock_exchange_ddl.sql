create table daily_quotes (
    company varchar(50),
    quote_date date,
    open decimal,
    high decimal,
    low decimal,
    close decimal,
    volume decimal
);

drop table quote;
create table quote (
    symbol varchar(5),
    totalDemand long,
    totalSupply long,
    bestBid decimal,
    bestAsk decimal,
    prevClose decimal,
    lastPrice decimal,
    `change` decimal,
    turnOver long,
    deals long,
    time timeStamp
);

create table credential(
    credential_id varchar(60) primary key,
    password varchar(20) not null,
    role varchar(20) default "USER"
);

drop table person;
create table person (
    person_id varchar(40) primary key,
    credential_id varchar(60),
    token_id varchar(40),
    foreign key (credential_id) references credential (credential_id)
);

create table access_element(
    foreign key (person_id) references person (person_id),
    token_id varchar(40) primary key,
    created timeStamp,
    expiry timeStamp
);


alter table access_element
add column person_id varchar(40) after token_id,
add constraint fk_access_element_person 
foreign key (person_id) references  person(person_id);


select * from access_element
where person_id = (select person_id from person where credential_id = "moses2@domain.com");

delete from access_element
where person_id = (select person_id from person where credential_id = "moses2@domain.com");
delete from person where credential_id = "moses2@domain.com";
delete from credential where credential_id = "moses2@domain.com";

create table company (
    company_id varchar(20) primary key,
    stock_id varchar(5),
    foreign key (stock_id) references stock(stock_id)
);

update stock 
set company_id = (select stock_id from company);


insert into stock (company_id)
select company.company_id from company, stock
where company.stock_id = stock.stock_id;

insert into stock_exp
select stock_id, stock_id as company_id, company_name, shares_listed, par_value, current_price 
from stock;

create table company_exp like company;
alter table company_exp
add column name varchar(100) after company_id;

insert into company_exp
select company_id, company_name as name, stock_id from stock;

create table `order` (
    order_id varchar(40) primary key,
    person_id varchar(40),
    stock_id varchar(5),
    units long,
    type varchar(10), 
    created timestamp,
    expiry timestamp,
    foreign key (person_id) references person (person_id),
    foreign key (stock_id) references stock (stock_id)
);

create table person_stock(
    person_id varchar(40),
    stock_id varchar(5),
    units long,
    foreign key (person_id) references person (person_id),
    foreign key (stock_id) references stock (stock_id)
);

create table cash_transaction(
    id varchar(40) primary key,
    timestamp timestamp,
    type varchar(10),
    credit varchar(40),
    debit varchar(40),
    amount decimal(10,2),
    foreign key (credit) references person (person_id),
    foreign key (debit) references person (person_id)
);

create table stock_transaction(
    id varchar(40) primary key,
    `timestamp` timestamp,
    seller varchar(40),
    buyer varchar(40),
    stock_id varchar(40),
    units long,
    price decimal(10,2),
    foreign key (seller) references person (person_id),
    foreign key (buyer) references person (person_id)
);

insert into credential(
    system@musestockexchange.com, null, SYSTEM
);