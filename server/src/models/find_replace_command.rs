use crate::models::FindReplaceCommand;
use diesel::prelude::*;
use diesel::insert_into;

pub fn get_find_replace_command(conn: &crate::db::DbPoolConn, user_shortcode: String) -> Option<FindReplaceCommand> {
    use crate::models::schema::find_replace_commands::dsl::*;
    let results = find_replace_commands.filter(shortcode.eq(user_shortcode))
        .first::<FindReplaceCommand>(conn).ok();

    // println!("Displaying posts");
    // println!("{:#?}", results);
    results
}

pub fn insert_find_replace_command(conn: &crate::db::DbPoolConn, to_insert: &FindReplaceCommand) -> QueryResult<usize> {
    insert_into(crate::models::schema::find_replace_commands::table).values(to_insert).execute(conn)
}