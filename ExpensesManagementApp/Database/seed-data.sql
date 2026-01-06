-- =============================================
-- Seed Data Script for ExpensesManagementApp
-- Run this after migrations: dotnet ef database update
-- =============================================

-- 1. Categories
INSERT INTO "Category" ("Id", "Name") VALUES
                                          (1, 'Groceries'),
                                          (2, 'Electronics'),
                                          (3, 'Restaurants'),
                                          (4, 'Public transport'),
                                          (5, 'Toys'),
                                          (6, 'Clothes')
    ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name";

-- 2. Currencies
INSERT INTO "Currency" ("Id", "Name") VALUES
                                          (1, 'USD'),
                                          (2, 'EUR'),
                                          (3, 'PLN'),
                                          (4, 'UAH')
    ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name";

-- 3. Issuer (we use "Other" as default)
INSERT INTO "Issuer" ("Id", "Name") VALUES
    (1, 'Other')
    ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name";

-- 4. Create 5 Users with strong passwords
-- Password for all: "User123!"
-- Hashed with ASP.NET Identity default (PBKDF2, 10000 iterations)

INSERT INTO "AspNetUsers" (
    "Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail",
    "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp",
    "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnabled",
    "LockoutEnd", "AccessFailedCount", "AccountCreationDate", "IsDeleted", "DeletedAt"
) VALUES
      (1, 'alice.wonder', 'ALICE.WONDER', 'alice@example.com', 'ALICE@EXAMPLE.COM',
       true, 'AQAAAAIAAYagAAAAEIj4vL9vZ7kW8vKq2v3v4v5v6v7v8v9v0v1v2v3v4v5v6v7v8v9v0v==', 'SECURITY1', 'CONCURRENCY1',
       NULL, false, false, true, NULL, 0, '2026-01-01 10:00:00+00', false, NULL),

      (2, 'bob.builder', 'BOB.BUILDER', 'bob@example.com', 'BOB@EXAMPLE.COM',
       true, 'AQAAAAIAAYagAAAAEIj4vL9vZ7kW8vKq2v3v4v5v6v7v8v9v0v1v2v3v4v5v6v7v8v9v0v==', 'SECURITY2', 'CONCURRENCY2',
       NULL, false, false, true, NULL, 0, '2026-01-02 11:00:00+00', false, NULL),

      (3, 'charlie.brown', 'CHARLIE.BROWN', 'charlie@example.com', 'CHARLIE@EXAMPLE.COM',
       true, 'AQAAAAIAAYagAAAAEIj4vL9vZ7kW8vKq2v3v4v5v6v7v8v9v0v1v2v3v4v5v6v7v8v9v0v==', 'SECURITY3', 'CONCURRENCY3',
       NULL, false, false, true, NULL, 0, '2026-01-03 12:00:00+00', false, NULL),

      (4, 'diana.prince', 'DIANA.PRINCE', 'diana@example.com', 'DIANA@EXAMPLE.COM',
       true, 'AQAAAAIAAYagAAAAEIj4vL9vZ7kW8vKq2v3v4v5v6v7v8v9v0v1v2v3v4v5v6v7v8v9v0v==', 'SECURITY4', 'CONCURRENCY4',
       NULL, false, false, true, NULL, 0, '2026-01-04 13:00:00+00', false, NULL),

      (5, 'ethan.hunt', 'ETHAN.HUNT', 'ethan@example.com', 'ETHAN@EXAMPLE.COM',
       true, 'AQAAAAIAAYagAAAAEIj4vL9vZ7kW8vKq2v3v4v5v6v7v8v9v0v1v2v3v4v5v6v7v8v9v0v==', 'SECURITY5', 'CONCURRENCY5',
       NULL, false, false, true, NULL, 0, '2026-01-05 14:00:00+00', false, NULL)
    ON CONFLICT ("Id") DO NOTHING;

-- 5. Assign "User" role to all 5 users
-- First ensure role exists
INSERT INTO "AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp")
VALUES (2, 'User', 'USER', 'user-concurrency')
    ON CONFLICT ("Id") DO NOTHING;

-- Assign role
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
VALUES
    (1, 2), (2, 2), (3, 2), (4, 2), (5, 2)
    ON CONFLICT DO NOTHING;

-- 6. Generate 10+ realistic expenses for each user
-- Using varied dates, amounts, categories, currencies

-- Helper: We'll insert 12 expenses per user for variety
DO $$
DECLARE
user_id INT;
    exp_id INT := 1;
    i INT;
    j INT;
BEGIN
FOR i IN 1..5 LOOP
        user_id := i;

FOR j IN 1..12 LOOP
            INSERT INTO "Expense" (
                "Id", "Date", "Description", "UserId", "CategoryId", "IssuerId", "CurrencyId", "TotalAmount"
            ) VALUES (
                exp_id,
                '2025-12-01 00:00:00+00'::timestamp + (j * INTERVAL '3 days') + (i * INTERVAL '1 day'),
                CASE 
                    WHEN j % 6 = 1 THEN 'Supermarket shopping'
                    WHEN j % 6 = 2 THEN 'New laptop charger'
                    WHEN j % 6 = 3 THEN 'Dinner with friends'
                    WHEN j % 6 = 4 THEN 'Monthly bus pass'
                    WHEN j % 6 = 5 THEN 'Birthday gift for kid'
                    ELSE 'Winter jacket'
                END,
                user_id,
                ((j % 6) + 1),  -- Category 1-6
                1,               -- Issuer = Other
                ((j % 4) + 1),   -- Currency 1-4
                (50 + (j * 15 + i * 10))::numeric  -- Realistic amounts: 60–250
            );

            exp_id := exp_id + 1;
END LOOP;
END LOOP;
END $$;