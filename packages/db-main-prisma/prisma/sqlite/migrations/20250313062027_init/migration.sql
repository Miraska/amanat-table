-- CreateTable
CREATE TABLE "space" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "credit" INTEGER,
    "deleted_time" DATETIME,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT,
    "last_modified_time" DATETIME
);

-- CreateTable
CREATE TABLE "pin_resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "order" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "base" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "space_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" REAL NOT NULL,
    "icon" TEXT,
    "schema_pass" TEXT,
    "deleted_time" DATETIME,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT,
    "last_modified_time" DATETIME,
    CONSTRAINT "base_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "table_meta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "base_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "db_table_name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "order" REAL NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "deleted_time" DATETIME,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT,
    CONSTRAINT "table_meta_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "base" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "options" TEXT,
    "type" TEXT NOT NULL,
    "cell_value_type" TEXT NOT NULL,
    "is_multiple_cell_value" BOOLEAN,
    "db_field_type" TEXT NOT NULL,
    "db_field_name" TEXT NOT NULL,
    "not_null" BOOLEAN,
    "unique" BOOLEAN,
    "is_primary" BOOLEAN,
    "is_computed" BOOLEAN,
    "is_lookup" BOOLEAN,
    "is_pending" BOOLEAN,
    "has_error" BOOLEAN,
    "lookup_linked_field_id" TEXT,
    "lookup_options" TEXT,
    "table_id" TEXT NOT NULL,
    "order" REAL NOT NULL,
    "version" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "deleted_time" DATETIME,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT,
    CONSTRAINT "field_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "table_meta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "view" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "table_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sort" TEXT,
    "filter" TEXT,
    "group" TEXT,
    "options" TEXT,
    "order" REAL NOT NULL,
    "version" INTEGER NOT NULL,
    "column_meta" TEXT NOT NULL,
    "is_locked" BOOLEAN,
    "enable_share" BOOLEAN,
    "share_id" TEXT,
    "share_meta" TEXT,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "deleted_time" DATETIME,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT,
    CONSTRAINT "view_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "table_meta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ops" (
    "collection" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "snapshots" (
    "collection" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "reference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from_field_id" TEXT NOT NULL,
    "to_field_id" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "salt" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "is_system" BOOLEAN,
    "is_admin" BOOLEAN,
    "notify_meta" TEXT,
    "last_sign_time" DATETIME,
    "deactivated_time" DATETIME,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_time" DATETIME,
    "last_modified_time" DATETIME,
    "ref_meta" TEXT
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "deleted_time" DATETIME,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT,
    "thumbnail_path" TEXT
);

-- CreateTable
CREATE TABLE "attachments_table" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attachment_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT,
    "last_modified_time" DATETIME
);

-- CreateTable
CREATE TABLE "collaborator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role_name" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "principal_id" TEXT NOT NULL,
    "principal_type" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "last_modified_by" TEXT
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "base_id" TEXT,
    "space_id" TEXT,
    "type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "invitation_code" TEXT NOT NULL,
    "expired_time" DATETIME,
    "create_by" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "last_modified_by" TEXT,
    "deleted_time" DATETIME
);

-- CreateTable
CREATE TABLE "invitation_record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitation_id" TEXT NOT NULL,
    "base_id" TEXT,
    "space_id" TEXT,
    "type" TEXT NOT NULL,
    "inviter" TEXT NOT NULL,
    "accepter" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url_path" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "access_token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "space_ids" TEXT,
    "base_ids" TEXT,
    "sign" TEXT NOT NULL,
    "client_id" TEXT,
    "expired_time" DATETIME NOT NULL,
    "last_used_time" DATETIME,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME
);

-- CreateTable
CREATE TABLE "setting" (
    "instance_id" TEXT NOT NULL PRIMARY KEY,
    "disallow_sign_up" BOOLEAN,
    "disallow_space_creation" BOOLEAN,
    "disallow_space_invitation" BOOLEAN,
    "enable_email_verification" BOOLEAN,
    "ai_config" TEXT
);

-- CreateTable
CREATE TABLE "oauth_app" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "homepage" TEXT NOT NULL,
    "description" TEXT,
    "client_id" TEXT NOT NULL,
    "redirect_uris" TEXT,
    "scopes" TEXT,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "oauth_app_authorized" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "authorized_time" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "oauth_app_secret" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "masked_secret" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_used_time" DATETIME
);

-- CreateTable
CREATE TABLE "oauth_app_token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "app_secret_id" TEXT NOT NULL,
    "refresh_token_sign" TEXT NOT NULL,
    "expired_time" DATETIME NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "record_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "table_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "before" TEXT NOT NULL,
    "after" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "trash" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "deleted_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "table_trash" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "table_id" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "snapshot" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "record_trash" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "table_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "snapshot" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "plugin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "detail_desc" TEXT,
    "logo" TEXT NOT NULL,
    "help_url" TEXT,
    "status" TEXT NOT NULL,
    "positions" TEXT NOT NULL,
    "url" TEXT,
    "secret" TEXT NOT NULL,
    "masked_secret" TEXT NOT NULL,
    "i18n" TEXT,
    "plugin_user" TEXT,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT
);

-- CreateTable
CREATE TABLE "plugin_install" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plugin_id" TEXT NOT NULL,
    "base_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "storage" TEXT,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_modified_time" DATETIME,
    "last_modified_by" TEXT,
    CONSTRAINT "plugin_install_plugin_id_fkey" FOREIGN KEY ("plugin_id") REFERENCES "plugin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dashboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "base_id" TEXT NOT NULL,
    "layout" TEXT,
    "created_by" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "last_modified_by" TEXT
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "table_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "quote_Id" TEXT,
    "content" TEXT,
    "reaction" TEXT,
    "deleted_time" DATETIME,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_modified_time" DATETIME
);

-- CreateTable
CREATE TABLE "comment_subscription" (
    "table_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "automations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "trigger_type" TEXT NOT NULL,
    "trigger_config" JSONB,
    "conditions" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trigger_filter" JSONB,
    "trigger_fields" JSONB,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "last_modified_time" DATETIME,
    "tableIdOrName" TEXT,
    "tableId" TEXT,
    "watchFields" JSONB,
    "triggerLabel" TEXT,
    "triggerDescription" TEXT,
    CONSTRAINT "automations_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "table_meta" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "automation_actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "params" JSONB,
    "conditions" JSONB,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "label" TEXT,
    "description" TEXT,
    "inputVars" JSONB,
    CONSTRAINT "automation_actions_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "automation_execution_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "status" TEXT,
    "event_data" JSONB,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isTest" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "automation_execution_logs_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "automation_action_execution_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "execution_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "status" TEXT,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consoleLogs" JSONB,
    CONSTRAINT "automation_action_execution_logs_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "automation_execution_logs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "automation_action_execution_logs_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "automation_actions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "pin_resource_order_idx" ON "pin_resource"("order");

-- CreateIndex
CREATE UNIQUE INDEX "pin_resource_created_by_resource_id_key" ON "pin_resource"("created_by", "resource_id");

-- CreateIndex
CREATE INDEX "base_order_idx" ON "base"("order");

-- CreateIndex
CREATE INDEX "table_meta_order_idx" ON "table_meta"("order");

-- CreateIndex
CREATE INDEX "field_lookup_linked_field_id_idx" ON "field"("lookup_linked_field_id");

-- CreateIndex
CREATE INDEX "view_order_idx" ON "view"("order");

-- CreateIndex
CREATE INDEX "ops_collection_created_time_idx" ON "ops"("collection", "created_time");

-- CreateIndex
CREATE UNIQUE INDEX "ops_collection_doc_id_version_key" ON "ops"("collection", "doc_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "snapshots_collection_doc_id_key" ON "snapshots"("collection", "doc_id");

-- CreateIndex
CREATE INDEX "reference_from_field_id_idx" ON "reference"("from_field_id");

-- CreateIndex
CREATE INDEX "reference_to_field_id_idx" ON "reference"("to_field_id");

-- CreateIndex
CREATE UNIQUE INDEX "reference_to_field_id_from_field_id_key" ON "reference"("to_field_id", "from_field_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_id_key" ON "account"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "attachments_token_key" ON "attachments"("token");

-- CreateIndex
CREATE UNIQUE INDEX "collaborator_resource_type_resource_id_principal_id_principal_type_key" ON "collaborator"("resource_type", "resource_id", "principal_id", "principal_type");

-- CreateIndex
CREATE INDEX "notification_to_user_id_is_read_created_time_idx" ON "notification"("to_user_id", "is_read", "created_time");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_app_client_id_key" ON "oauth_app"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_app_authorized_client_id_user_id_key" ON "oauth_app_authorized"("client_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_app_secret_secret_key" ON "oauth_app_secret"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_app_token_refresh_token_sign_key" ON "oauth_app_token"("refresh_token_sign");

-- CreateIndex
CREATE INDEX "record_history_table_id_record_id_created_time_idx" ON "record_history"("table_id", "record_id", "created_time");

-- CreateIndex
CREATE INDEX "record_history_table_id_created_time_idx" ON "record_history"("table_id", "created_time");

-- CreateIndex
CREATE UNIQUE INDEX "trash_resource_type_resource_id_key" ON "trash"("resource_type", "resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "plugin_secret_key" ON "plugin"("secret");

-- CreateIndex
CREATE INDEX "comment_table_id_record_id_idx" ON "comment"("table_id", "record_id");

-- CreateIndex
CREATE INDEX "comment_subscription_table_id_record_id_idx" ON "comment_subscription"("table_id", "record_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_subscription_table_id_record_id_key" ON "comment_subscription"("table_id", "record_id");
