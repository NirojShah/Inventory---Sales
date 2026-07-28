# Prisma Schema Cheatsheet

This document contains the commonly used Prisma data types, field attributes, model attributes, relation attributes, and schema-level configuration.

---

# Basic Structure

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}
```

---

# Scalar Data Types

| Prisma Type | PostgreSQL Mapping | Example |
|-------------|--------------------|---------|
| String | TEXT | `name String` |
| Int | INTEGER | `age Int` |
| BigInt | BIGINT | `id BigInt` |
| Float | DOUBLE PRECISION | `salary Float` |
| Decimal | DECIMAL | `price Decimal` |
| Boolean | BOOLEAN | `isActive Boolean` |
| DateTime | TIMESTAMP | `createdAt DateTime` |
| Json | JSONB | `metadata Json` |
| Bytes | BYTEA | `file Bytes` |
| Unsupported("type") | Custom DB Type | `geom Unsupported("geometry")` |

---

# Optional Fields

```prisma
name String?
```

Generates

```sql
name TEXT NULL
```

---

# Required Fields

```prisma
name String
```

Required is the default.

Generates

```sql
name TEXT NOT NULL
```

---

# Primary Key

```prisma
id Int @id
```

Composite Primary Key

```prisma
@@id([userId, productId])
```

---

# Auto Increment

Integer

```prisma
id Int @id @default(autoincrement())
```

BigInt

```prisma
id BigInt @id @default(autoincrement())
```

---

# Default Values

Current Timestamp

```prisma
createdAt DateTime @default(now())
```

UUID

```prisma
id String @id @default(uuid())
```

CUID

```prisma
id String @id @default(cuid())
```

Random UUID v7 (Prisma versions that support it)

```prisma
id String @id @default(uuid(7))
```

Static Value

```prisma
status String @default("ACTIVE")
```

Boolean

```prisma
isAdmin Boolean @default(false)
```

Number

```prisma
age Int @default(18)
```

---

# Unique Constraint

Single Field

```prisma
email String @unique
```

Multiple Fields

```prisma
@@unique([firstName, lastName])
```

Named Constraint

```prisma
@@unique([email, phone], map: "unique_email_phone")
```

---

# Indexes

Single Column

```prisma
email String

@@index([email])
```

Multiple Columns

```prisma
@@index([firstName, lastName])
```

Named Index

```prisma
@@index([email], map: "idx_email")
```

---

# Relations

One-to-One

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

---

One-to-Many

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  userId   Int
  author   User @relation(fields: [userId], references: [id])
}
```

---

Many-to-Many (Implicit)

```prisma
model Student {
  id      Int      @id @default(autoincrement())
  courses Course[]
}

model Course {
  id       Int       @id @default(autoincrement())
  students Student[]
}
```

---

Many-to-Many (Explicit)

```prisma
model Student {
  id      Int @id @default(autoincrement())
  courses StudentCourse[]
}

model Course {
  id       Int @id @default(autoincrement())
  students StudentCourse[]
}

model StudentCourse {
  studentId Int
  courseId  Int

  student Student @relation(fields: [studentId], references: [id])
  course  Course  @relation(fields: [courseId], references: [id])

  @@id([studentId, courseId])
}
```

---

# Relation Options

```prisma
@relation(
  fields: [userId],
  references: [id],
  onDelete: Cascade,
  onUpdate: Cascade
)
```

Available options

- Cascade
- Restrict
- NoAction
- SetNull
- SetDefault

---

# Enum

```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}
```

Usage

```prisma
role Role
```

Default Enum

```prisma
role Role @default(USER)
```

---

# Database Specific Types

## PostgreSQL

```prisma
name String @db.VarChar(100)

description String @db.Text

price Decimal @db.Decimal(10,2)

age Int @db.SmallInt

id BigInt @db.BigInt

createdAt DateTime @db.Timestamp(6)

data Json @db.JsonB

ip String @db.Inet

mac String @db.MacAddr

money Decimal @db.Money

uuid String @db.Uuid
```

---

## MySQL

```prisma
name String @db.VarChar(100)

price Decimal @db.Decimal(10,2)

createdAt DateTime @db.DateTime(6)

data Json @db.Json
```

---

## SQL Server

```prisma
name String @db.NVarChar(100)

description String @db.NText

price Decimal @db.Decimal(10,2)
```

---

## SQLite

SQLite ignores most native database types.

```prisma
name String
```

---

# Field Attributes

| Attribute | Description |
|-----------|-------------|
| @id | Primary Key |
| @unique | Unique Constraint |
| @default() | Default Value |
| @updatedAt | Auto update timestamp |
| @map() | Map field name |
| @relation() | Relation |
| @ignore | Ignore field |
| @db.* | Native database type |

Example

```prisma
createdAt DateTime @default(now())

updatedAt DateTime @updatedAt

email String @unique

name String @map("full_name")
```

---

# Model Attributes

| Attribute | Description |
|------------|-------------|
| @@id | Composite Primary Key |
| @@unique | Composite Unique Constraint |
| @@index | Index |
| @@map | Rename Table |
| @@ignore | Ignore Model |
| @@schema | Database Schema |

Example

```prisma
@@map("users")

@@index([email])

@@unique([firstName, lastName])

@@id([userId, roleId])
```

---

# Mapping

Rename Table

```prisma
model User {
  id Int @id

  @@map("users")
}
```

Rename Column

```prisma
firstName String @map("first_name")
```

---

# Ignore

Ignore Field

```prisma
password String @ignore
```

Ignore Model

```prisma
@@ignore
```

---

# Updated Timestamp

```prisma
updatedAt DateTime @updatedAt
```

Automatically updates whenever the row changes.

---

# Comments

```prisma
// Single Line

/// Documentation Comment
```

---

# Common ID Strategies

Auto Increment

```prisma
id Int @id @default(autoincrement())
```

UUID

```prisma
id String @id @default(uuid())
```

CUID

```prisma
id String @id @default(cuid())
```

BigInt

```prisma
id BigInt @id @default(autoincrement())
```

---

# Common Model Example

```prisma
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  firstName   String   @db.VarChar(50)
  lastName    String   @db.VarChar(50)
  password    String
  age         Int?
  isActive    Boolean  @default(true)
  role        Role     @default(USER)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts        Post[]

  @@map("users")
  @@index([email])
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  userId    Int
  author    User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
}
```

---

# Common Prisma CLI Commands

```bash
# Initialize Prisma
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create Migration
npx prisma migrate dev --name init

# Apply Existing Migrations
npx prisma migrate deploy

# Push Schema Without Migration
npx prisma db push

# Pull Existing Database Schema
npx prisma db pull

# Reset Database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Validate Schema
npx prisma validate

# Format Schema
npx prisma format
```