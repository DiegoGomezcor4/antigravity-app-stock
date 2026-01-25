-- Create Products Table
create table products (
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

-- Create Customers Table
create table customers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  contact text,
  email text
);

-- Create Sales Table
create table sales (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  total numeric not null,
  total_cost numeric default 0,
  customer_id uuid references customers(id),
  items jsonb -- Stores the array of items sold
);

-- Enable RLS (Optional for now, but good practice)
alter table products enable row level security;
alter table customers enable row level security;
alter table sales enable row level security;

-- Create Policies (Public access for simplicity in this demo)
create policy "Public access" on products for all using (true);
create policy "Public access" on customers for all using (true);
create policy "Public access" on sales for all using (true);
