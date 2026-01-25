-- 1. Reset (Optional: carefull, this deletes data!)
-- drop table if exists products cascade;
-- drop table if exists customers cascade;
-- drop table if exists sales cascade;

-- 2. Create Tables (If not exist)
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  quantity integer default 0,
  price numeric default 0,
  cost numeric default 0,
  min_stock integer default 5,
  description text,
  image text
);

create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  contact text,
  email text
);

create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  total numeric not null,
  total_cost numeric default 0,
  customer_id uuid references customers(id),
  items jsonb
);

-- 3. Security Policies (The Fix)
-- Enable RLS
alter table products enable row level security;
alter table customers enable row level security;
alter table sales enable row level security;

-- Remove old policies to avoid conflicts
drop policy if exists "Public access" on products;
drop policy if exists "Public access" on customers;
drop policy if exists "Public access" on sales;

-- Create explicit full access policies
create policy "Enable access to all users" on products for all using (true) with check (true);
create policy "Enable access to all users" on customers for all using (true) with check (true);
create policy "Enable access to all users" on sales for all using (true) with check (true);
