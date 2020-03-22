use crate::models::FindReplaceCommand;
use diesel::prelude::*;
use diesel::insert_into;

pub fn get_find_replace_command(conn: &crate::db::DbPoolConn, user_shortcode: String) -> Option<FindReplaceCommand> {
    use crate::schema::find_replace_commands::dsl::*;

    let results = find_replace_commands.filter(shortcode.eq(user_shortcode))
        .first::<FindReplaceCommand>(conn).ok();

    // println!("Displaying posts");
    // println!("{:#?}", results);
    results
}

pub fn insert_find_replace_command(conn: &crate::db::DbPoolConn, user_shortcode: String) -> QueryResult<usize> {
    // use crate::schema::find_replace_commands::dsl::*;
    insert_into(crate::schema::find_replace_commands::table).values(&FindReplaceCommand {
        id: 0,
        find: "".to_string(),
        replace: "".to_string(),
        command: "".to_string(),
        shortcode: "".to_string(),
    }).execute(conn)
}