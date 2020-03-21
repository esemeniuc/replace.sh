use diesel::prelude::*;
use diesel::r2d2::{Pool, ConnectionManager};
use dotenv::dotenv;
use std::env;
use crate::models::FindReplaceCommand;

// #[derive(Clone)]
pub struct DatabasePool {
    pub connection: DbPool,
}

pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;

// impl Default for DatabasePool {
//     fn default() -> Self {
//         DatabasePool { connection: DatabasePool::establish_connection() }
//     }
// }

impl DatabasePool {
    pub fn establish_connection() -> DbPool {
        dotenv().ok();

        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let manager = ConnectionManager::<SqliteConnection>::new(database_url);
        Pool::builder().build(manager).expect("Failed to create pool.")
    }

    pub fn get_find_replace_command(&self, user_shortcode: String) -> Option<FindReplaceCommand> {
        use crate::schema::find_replace_commands::dsl::*;
        let x = &self.connection.get().unwrap();

        let results = find_replace_commands.filter(shortcode.eq(user_shortcode))
            .first::<FindReplaceCommand>(x).ok();
        // .expect("Error loading posts");

        println!("Displaying posts");
        println!("{:#?}", results);
        results
    }
    // fn insert_frc(&self, frc: &FindReplaceCommand) -> FieldResult<Human> {
    //     Err("")?
    // }
}