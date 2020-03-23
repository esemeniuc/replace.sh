pub mod find_replace_command;
mod schema;
use schema::find_replace_commands;

#[derive(Queryable, Debug, Insertable)]
pub struct FindReplaceCommand {
    pub id: i32,
    pub find: String,
    pub replace: String,
    pub command: String,
    pub shortcode: String,
}

#[derive(Debug, Insertable)]
#[table_name = "find_replace_commands"]
pub struct NewFindReplaceCommand {
    pub find: String,
    pub replace: String,
    pub command: String,
    pub shortcode: String,
}