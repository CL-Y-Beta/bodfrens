# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_10_17_134352) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_exercises", force: :cascade do |t|
    t.bigint "exercise_id", null: false
    t.boolean "complete", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_game_datum_id"
    t.index ["exercise_id"], name: "index_active_exercises_on_exercise_id"
    t.index ["user_game_datum_id"], name: "index_active_exercises_on_user_game_datum_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "badges", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_url"
  end

  create_table "earned_badges", force: :cascade do |t|
    t.bigint "badge_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "badge_title"
    t.index ["badge_id"], name: "index_earned_badges_on_badge_id"
    t.index ["user_id"], name: "index_earned_badges_on_user_id"
  end

  create_table "exercises", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.integer "exercise_xp"
    t.boolean "is_bonus"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_url"
  end

  create_table "rooms", force: :cascade do |t|
    t.integer "winner_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "mode"
    t.boolean "bonus", default: false
    t.integer "user_count", default: 0
    t.integer "bonus_count_multiplayer", default: 0
    t.boolean "circuit"
  end

  create_table "user_game_data", force: :cascade do |t|
    t.bigint "room_id", null: false
    t.integer "time_taken"
    t.boolean "finish"
    t.boolean "bonus_finish"
    t.bigint "user_id"
    t.integer "game_xp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["room_id"], name: "index_user_game_data_on_room_id"
    t.index ["user_id"], name: "index_user_game_data_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "username"
    t.string "uid"
    t.string "avatar_url"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_exercises", "exercises"
  add_foreign_key "active_exercises", "user_game_data"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "earned_badges", "badges"
  add_foreign_key "earned_badges", "users"
  add_foreign_key "user_game_data", "rooms"
  add_foreign_key "user_game_data", "users"
end
