-- CreateTable
CREATE TABLE "debezium_signal" (
    "id" VARCHAR(42) NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "data" VARCHAR(2048),

    CONSTRAINT "debezium_signal_pkey" PRIMARY KEY ("id")
);

-- Debezium writes snapshot window markers to the signal table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'debezium') THEN
    GRANT INSERT, UPDATE, DELETE ON "debezium_signal" TO debezium;
  END IF;
END
$$;
