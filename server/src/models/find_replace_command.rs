use crate::models::FindReplaceCommand;
use diesel::prelude::*;

pub fn get_find_replace_command(conn: &crate::db::DbPoolConn, user_shortcode: String) -> Option<FindReplaceCommand> {
    use crate::schema::find_replace_commands::dsl::*;

    let results = find_replace_commands.filter(shortcode.eq(user_shortcode))
        .first::<FindReplaceCommand>(conn).ok();

    // println!("Displaying posts");
    // println!("{:#?}", results);
    results
}

