INSERT INTO "SELECT 
    'CREATE TABLE IF NOT EXISTS public.""' || table_name || '"" (' ||
    string_agg(
        '""' || column_name || '"" ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')'
            ELSE ''
        END || 
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END, ', '
    ) || ');' AS export_sql
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name" (export_sql) VALUES
	 ('CREATE TABLE IF NOT EXISTS public."Activity" ("categoryId" text, "userProfileId" text NOT NULL, "id" text NOT NULL, "updatedAt" timestamp without time zone, "borrowingId" text, "createdAt" timestamp without time zone NOT NULL, "bannerId" text, "type" USER-DEFINED NOT NULL, "bookId" text);'),
	 ('CREATE TABLE IF NOT EXISTS public."Banner" ("imageUrls" ARRAY, "id" text NOT NULL, "createdAt" timestamp without time zone NOT NULL, "updatedAt" timestamp without time zone);'),
	 ('CREATE TABLE IF NOT EXISTS public."Book" ("quantity" integer NOT NULL, "title" text NOT NULL, "id" text NOT NULL, "categoryId" text NOT NULL, "description" text, "imageUrls" ARRAY, "price" integer NOT NULL, "updatedAt" timestamp without time zone, "remaining" integer NOT NULL, "active" boolean NOT NULL, "imageUrl" text, "author" text NOT NULL, "slug" text NOT NULL, "createdAt" timestamp without time zone NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."BookOrder" ("orderById" text NOT NULL, "totalAmount" integer NOT NULL, "orderNumber" text NOT NULL, "status" USER-DEFINED NOT NULL, "createdAt" timestamp without time zone NOT NULL, "memberId" text, "supplierContact" text, "supplierName" text NOT NULL, "updatedAt" timestamp without time zone NOT NULL, "note" text, "id" text NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."BookOrderItem" ("quantity" integer NOT NULL, "bookId" text NOT NULL, "orderId" text NOT NULL, "id" text NOT NULL, "createdAt" timestamp without time zone NOT NULL, "unitPrice" integer NOT NULL, "totalPrice" integer NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."BookReceipt" ("id" text NOT NULL, "note" text, "receivedAt" timestamp without time zone NOT NULL, "orderId" text NOT NULL, "receivedById" text NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."Borrow" ("borrowerId" text NOT NULL, "borrowDate" timestamp without time zone NOT NULL, "dueDate" timestamp without time zone NOT NULL, "returnDate" timestamp without time zone, "numberOfDays" integer NOT NULL, "damaged" integer NOT NULL, "isReturned" boolean NOT NULL, "fine" double precision NOT NULL, "status" USER-DEFINED NOT NULL, "createdAt" timestamp without time zone NOT NULL, "updatedAt" timestamp without time zone, "id" text NOT NULL, "bookId" text NOT NULL, "approverId" text NOT NULL, "returnApproverId" text);'),
	 ('CREATE TABLE IF NOT EXISTS public."BorrowReminder" ("reminderDay" timestamp without time zone NOT NULL, "borrowId" text NOT NULL, "id" text NOT NULL, "type" USER-DEFINED NOT NULL, "sentAt" timestamp without time zone NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."Category" ("description" text, "creatorId" text, "title" text NOT NULL, "slug" text NOT NULL, "createdAt" timestamp without time zone NOT NULL, "id" text NOT NULL, "updatedAt" timestamp without time zone, "imageUrl" text);'),
	 ('CREATE TABLE IF NOT EXISTS public."DepartmentBook" ("slug" text NOT NULL, "updatedAt" timestamp without time zone, "price" integer NOT NULL, "quantity" integer NOT NULL, "remaining" integer NOT NULL, "active" boolean NOT NULL, "createdAt" timestamp without time zone NOT NULL, "id" text NOT NULL, "title" text NOT NULL, "department" text NOT NULL, "author" text, "imageUrl" text, "imageUrls" ARRAY, "description" text);');
INSERT INTO "SELECT 
    'CREATE TABLE IF NOT EXISTS public.""' || table_name || '"" (' ||
    string_agg(
        '""' || column_name || '"" ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')'
            ELSE ''
        END || 
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END, ', '
    ) || ');' AS export_sql
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name" (export_sql) VALUES
	 ('CREATE TABLE IF NOT EXISTS public."FavoriteBook" ("id" text NOT NULL, "bookId" text NOT NULL, "createdAt" timestamp without time zone NOT NULL, "userId" text NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."Notification" ("userId" text NOT NULL, "id" text NOT NULL, "createdAt" timestamp without time zone NOT NULL, "updatedAt" timestamp without time zone NOT NULL, "isRead" boolean NOT NULL, "link" text, "message" text, "title" text NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."Reservation" ("createdAt" timestamp without time zone NOT NULL, "numberOfDays" integer NOT NULL, "id" text NOT NULL, "userId" text NOT NULL, "bookId" text NOT NULL, "isRead" boolean NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."User" ("password" text NOT NULL, "email" text, "username" text, "id" text NOT NULL, "updatedAt" timestamp without time zone, "createdAt" timestamp without time zone NOT NULL, "role" USER-DEFINED NOT NULL, "emailVerified" boolean NOT NULL, "lastUsedVerificationToken" text, "verificationToken" text);'),
	 ('CREATE TABLE IF NOT EXISTS public."UserProfile" ("phoneNumber" text, "educationYear" text, "description" text, "profileImage" text, "userId" text NOT NULL, "username" text NOT NULL, "id" text NOT NULL, "updatedAt" timestamp without time zone, "createdAt" timestamp without time zone NOT NULL, "prefix" text, "fullName" text, "codeNumber" text, "educationLevel" text, "emailAddress" text NOT NULL);'),
	 ('CREATE TABLE IF NOT EXISTS public."_prisma_migrations" ("migration_name" character varying(255) NOT NULL, "checksum" character varying(64) NOT NULL, "rolled_back_at" timestamp with time zone, "started_at" timestamp with time zone NOT NULL, "id" character varying(36) NOT NULL, "finished_at" timestamp with time zone, "applied_steps_count" integer NOT NULL, "logs" text);');
