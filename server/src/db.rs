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

pub fn run_migrations(pool: &DbPool) -> Result<(), diesel_migrations::RunMigrationsError> {
    embed_migrations!("migrations");
    // This will run the necessary migrations.
    // embedded_migrations::run(&pool.get().unwrap());

    // By default the output is thrown out. If you want to redirect it to stdout, you
    // should call embedded_migrations::run_with_output.
    embedded_migrations::run_with_output(&pool.get().unwrap(), &mut std::io::stdout())
}