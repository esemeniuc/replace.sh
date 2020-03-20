use diesel::prelude::*;
use dotenv::dotenv;
use std::env;
use crate::models::FindReplaceCommand;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

struct DatabasePool;

impl DatabasePool {
    // fn get_connection(&self) -> DatabasePool { DatabasePool }
    fn find_human(&self, user_shortcode: &str) -> FindReplaceCommand {
        use crate::schema::find_replace_commands::dsl::*;

        let connection = establish_connection();
        let results = find_replace_commands.filter(shortcode.eq(user_shortcode))
            .first::<FindReplaceCommand>(&connection)
            .expect("Error loading posts");

        println!("Displaying posts");
        println!("{:#?}", results);
        results
    }
    // fn insert_human(&self, _human: &NewHuman) -> FieldResult<Human> { Err("")? }
}