use juniper::{FieldResult, RootNode};
use crate::models::{FindReplaceCommand, find_replace_command};

impl std::convert::From<crate::models::FindReplaceCommandRow> for FindReplaceCommand {
    fn from(other: crate::models::FindReplaceCommandRow) -> Self {
        FindReplaceCommand {
            find: other.find,
            replace: other.replace,
            command: other.command,
            shortcode: other.shortcode,
        }
    }
}

pub struct Context {
    pub pool: crate::db::DbPool,
}

impl juniper::Context for Context {}

pub struct Query;

#[juniper::object(
// Here we specify the context type for this object.
Context = Context,
)]
impl Query {
    #[graphql(description = "A tuple for the user's form submission")]
    fn get_find_replace_command(context: &Context, shortcode: String) -> FieldResult<Option<FindReplaceCommand>> {
        let conn = context.pool.get().unwrap();
        match find_replace_command::get_find_replace_command(&conn, shortcode) {
            Some(frc) => Ok(Option::from(FindReplaceCommand::from(frc))),
            None => Ok(None)
        }
    }
}

fn generate_command(find: &String, replace: &String) -> String {
    format!("sed 's/{}/{}/g'", find, replace) //todo: escape properly
}

pub struct Mutation;

#[juniper::object(Context = Context)]
impl Mutation {
    #[graphql(description = "Returns a url for accessing the tuple")]
    fn create_command(context: &Context, find: String, replace: String) -> FieldResult<FindReplaceCommand> {
        use names::{Generator, Name};
        let mut generator = Generator::with_naming(Name::Numbered);
        match generator.next() {
            Some(phrase) => {
                let conn = context.pool.get().unwrap();
                let command = generate_command(&find, &replace);
                let frc = crate::models::FindReplaceCommand {
                    find,
                    replace,
                    command,
                    shortcode: phrase,
                };

                println!("inserting {:?}", frc);

                match find_replace_command::insert_find_replace_command(&conn, &frc) {
                    Ok(_) => Ok(frc),
                    Err(_) => Err(juniper::FieldError::new("Cannot save to db", graphql_value!({"type": "NO_DB_SAVE"})))
                }
            }
            None => Err(juniper::FieldError::new("Cannot generate shortcode", graphql_value!({"type": "NO_SHORTCODE"})))
        }
    }
}

pub type Schema = RootNode<'static, Query, Mutation>;

pub fn create_schema() -> Schema {
    Schema::new(Query {}, Mutation {})
}