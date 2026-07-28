# Prisma Workflow

## 1. Create a New Prisma Project

```bash
npx prisma init
```

### What it does

- Creates a `prisma/` folder.
- Creates `schema.prisma`.
- Creates a `.env` file.
- Adds a sample datasource and generator configuration.

---

## 2. Generate Prisma Client

```bash
npx prisma generate
```

### What it does

- Generates the Prisma Client based on your schema.
- Required after changing the schema if migrations haven't already regenerated the client.
- Creates the client inside `node_modules/@prisma/client`.

Use this when:

- You changed your Prisma schema.
- You changed generators.
- You ran `npm install`.

---

## 3. Create a Migration (Recommended)

```bash
npx prisma migrate dev --name init
```

### What it does

- Compares your `schema.prisma` with the database.
- Creates a SQL migration.
- Applies the migration to your database.
- Updates the Prisma Client automatically.
- Stores the migration in:

```
prisma/migrations/
```

Use this when:

- Developing your application.
- You changed your models.
- You want version-controlled database changes.

Example:

```prisma
model User {
  id    Int @id @default(autoincrement())
  email String
}
```

After adding a field:

```prisma
name String
```

Run:

```bash
npx prisma migrate dev --name add-name
```

Prisma will generate SQL similar to:

```sql
ALTER TABLE "User"
ADD COLUMN "name" TEXT NOT NULL;
```

---

## 4. Push Schema Without Migration

```bash
npx prisma db push
```

### What it does

- Updates the database schema directly.
- Does **not** create migration files.
- Updates the Prisma Client.

Use this when:

- Prototyping.
- Learning Prisma.
- Local development without migration history.

Do **not** use this in production because there is no migration history.

---

## 5. Pull Existing Database

```bash
npx prisma db pull
```

### What it does

Reads the existing database and generates the Prisma schema automatically.

Use this when:

- Database already exists.
- Working with a legacy database.
- Someone else created the database.

---

## 6. Reset Database

```bash
npx prisma migrate reset
```

### What it does

- Drops the database.
- Recreates it.
- Runs every migration again.
- Regenerates Prisma Client.
- Runs seed script (if configured).

Use this when:

- Development only.
- You want a clean database.

⚠️ This deletes all data.

---

## 7. Deploy Migrations

```bash
npx prisma migrate deploy
```

### What it does

Runs all pending migrations.

Use this in:

- Production
- Staging
- CI/CD pipelines

---

## 8. Open Prisma Studio

```bash
npx prisma studio
```

### What it does

Opens a browser-based GUI to view and edit your database.

Useful for:

- Browsing tables
- Editing records
- Creating records
- Deleting records

---

## 9. Validate Schema

```bash
npx prisma validate
```

### What it does

Checks if your Prisma schema is valid without changing the database.

---

## 10. Format Schema

```bash
npx prisma format
```

### What it does

Automatically formats `schema.prisma`.

Similar to running Prettier on your schema.

---

# Which Command Should I Run?

## First Time

```bash
npx prisma init
```

↓

Edit `schema.prisma`

↓

```bash
npx prisma migrate dev --name init
```

↓

Done

---

## I Added a New Table

Example:

```prisma
model Product {
  id    Int @id @default(autoincrement())
  name  String
}
```

Run:

```bash
npx prisma migrate dev --name add-product
```

---

## I Added a New Column

Example:

```prisma
price Float
```

Run:

```bash
npx prisma migrate dev --name add-price
```

---

## I Removed a Column

Run:

```bash
npx prisma migrate dev --name remove-price
```

---

## I Changed a Column Type

Example:

```prisma
age Int
```

↓

```prisma
age BigInt
```

Run:

```bash
npx prisma migrate dev --name change-age-type
```

---

## I Renamed a Field

Example:

```prisma
firstName
```

↓

```prisma
givenName
```

Run:

```bash
npx prisma migrate dev --name rename-first-name
```

> **Note:** Prisma cannot always detect a rename. It may generate SQL that drops the old column and creates a new one, which can lead to data loss. Review the generated migration before applying it.

---

## I Added a Relation

Example:

```prisma
user User @relation(fields: [userId], references: [id])
```

Run:

```bash
npx prisma migrate dev --name add-user-relation
```

---

## I Only Want to Sync the Database (No Migrations)

```bash
npx prisma db push
```

---

# Development Workflow

```
Edit schema.prisma
        │
        ▼
npx prisma migrate dev --name <migration-name>
        │
        ▼
Migration SQL is generated
        │
        ▼
Database is updated
        │
        ▼
Prisma Client is regenerated
        │
        ▼
Ready to use
```

---

# Production Workflow

```
Developer

Edit schema.prisma
        │
        ▼
npx prisma migrate dev --name add-orders
        │
        ▼
Commit code + migration
        │
        ▼
Push to Git
        │
        ▼
Deploy application
        │
        ▼
Production Server

npx prisma migrate deploy
```