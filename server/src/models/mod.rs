pub mod find_replace_command;
mod schema;
use schema::find_replace_commands;

#[derive(Queryable, Debug, Insertable)]
#[table_name = "find_replace_commands"]
pub struct FindReplaceCommandRow {
    pub id: i32,
    pub find: String,
    pub replace: String,
    pub command: String,
    pub is_global: bool,
    pub is_inplace: bool,
    pub shortcode: String,
}

#[derive(Debug, Insertable, juniper::GraphQLObject)]
#[table_name = "find_replace_commands"]
pub struct FindReplaceCommand {
    pub find: String,
    pub replace: String,
    pub command: String,
    pub is_global: bool,
    pub is_inplace: bool,
    pub shortcode: String,
}