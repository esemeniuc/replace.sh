pub mod find_replace_command;
// mod schema;
use crate::schema::find_replace_commands;

#[derive(Queryable, Debug, Insertable)]
#[table_name = "find_replace_commands"]
pub struct FindReplaceCommand {
    pub id: i32,
    pub find: String,
    pub replace: String,
    pub command: String,
    pub shortcode: String,
}