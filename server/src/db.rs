#[macro_use]
use diesel::prelude::*;
use dotenv::dotenv;
use std::env;
use crate::models::FindReplaceCommand;
// mod schema;
// use self::models::FindReplaceCommand;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

struct DatabasePool;

impl DatabasePool {
    fn get_connection(&self) -> DatabasePool { DatabasePool }
    fn find_human(&self, shortcode: &str) -> FindReplaceCommand {
        use crate::schema::find_replace_commands::dsl::*;

        let connection = establish_connection();
        // let results = find_replace_commands.filter(shortcode.eq(shortcode))
        //     .first::<FindReplaceCommand>(&connection)
        //     .expect("Error loading posts");
        //
        // println!("Displaying {} posts", results.len());
        // for post in results {
        //     // println!("{}", post.title);
        //     // println!("----------\n");
        //     // println!("{}", post.body);
        // }
        unimplemented!();
    }
    // fn insert_human(&self, _human: &NewHuman) -> FieldResult<Human> { Err("")? }
}