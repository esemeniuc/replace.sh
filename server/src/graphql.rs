use juniper::{FieldResult, GraphQLObject, RootNode};

#[derive(GraphQLObject)]
struct FindReplaceCommand {
    find: String,
    replace: String,
    command: String,
}

impl std::convert::From<crate::models::FindReplaceCommand> for FindReplaceCommand {
    fn from(other: crate::models::FindReplaceCommand) -> Self {
        FindReplaceCommand {
            find: other.find,
            replace: other.replace,
            command: other.command,
        }
    }
}

// #[derive(Default)]
pub struct Context {
    pub pool: crate::db::DatabasePool,
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
        match context.pool.get_find_replace_command(shortcode) {
            Some(frc) => Ok(Option::from(FindReplaceCommand::from(frc))),
            None => Ok(None)
        }
    }
}

pub struct Mutation;

#[juniper::object(Context = Context)]
impl Mutation {
    #[graphql(description = "Returns a url for accessing the tuple")]
    fn create_command(find: String, replace: String) -> FieldResult<String> {
        use names::{Generator, Name};
        let mut generator = Generator::with_naming(Name::Numbered);
        match generator.next() {
            Some(phrase) => {
                Ok(String::from("Foo"))
            }
            None => Err(juniper::FieldError::new("Cannot generate shortcode", graphql_value!({"type": "NO_SHORTCODE"})))
        }
    }
}

pub type Schema = RootNode<'static, Query, Mutation>;

pub fn create_schema() -> Schema {
    Schema::new(Query {}, Mutation {})
}