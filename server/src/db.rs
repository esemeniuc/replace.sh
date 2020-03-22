use diesel::prelude::*;
use diesel::r2d2::{Pool, PooledConnection, ConnectionManager};
use dotenv::dotenv;
use std::env;

pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;
pub type DbPoolConn = PooledConnection<ConnectionManager<SqliteConnection>>;

pub fn establish_connection() -> DbPool {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    Pool::builder().build(manager).expect("Failed to create pool.")
}
