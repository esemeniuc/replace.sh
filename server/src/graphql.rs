use juniper::{FieldResult, RootNode};
use crate::models::{FindReplaceCommand, find_replace_command};

impl std::convert::From<crate::models::FindReplaceCommandRow> for FindReplaceCommand {
    fn from(other: crate::models::FindReplaceCommandRow) -> Self {
        FindReplaceCommand {
            find: other.find,
            replace: other.replace,
            command: other.command,
            is_global: other.is_global,
            is_inplace: other.is_inplace,
            shortcode: other.shortcode,
        }
    }
}

//file based on https://github.com/actix/examples/tree/master/juniper
#[derive(Clone)]
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

fn generate_command(find: &String, replace: &String, is_global: &bool, is_inplace: &bool) -> String {
    //https://stackoverflow.com/questions/25569865/how-to-escape-curly-braces-in-a-format-string-in-rust
    let find = find.replace("/", "\\/").replace("\n", "\\n");
    let replace = replace.replace("/", "\\/").replace("\n", "\\\n"); //escape slashes since sed uses them, then escape newlines

    let global_flag = if *is_global {
        "g"
    } else {
        ""
    };

    return if *is_inplace {
        format!("sed -i 'H;1h;$!d ; x ; s/{}/{}/{}' INPUT_FILE.txt", find, replace, global_flag)
    } else {
        format!("sed 'H;1h;$!d ; x ; s/{}/{}/{}' INPUT_FILE.txt > OUTPUT_FILE.txt", find, replace, global_flag)
    };

// sed -z 's/findo1\n/replaco1\n/' -i INPUT_FILE.txt #not portable
// sed 'H;1h;$!d; x ; s/findo1\nfindo2\nfindo3\nfindo4/replaco1\nreplaco2\nreplaco3\nreplaceo4/g' INPUT_FILE.txt
// sed "H;1h;\$\!d; x ; s/findo1\nfindo2\nfindo3\nfindo4/replaco1\nreplaco2\nreplaco3\nreplaceo4/g" INPUT_FILE.txt
// https://unix.stackexchange.com/a/429141/402082
}

pub struct Mutation;

#[juniper::object(Context = Context)]
impl Mutation {
    #[graphql(description = "Returns a url for accessing the tuple")]
    fn create_command(context: &Context, find: String, replace: String, is_global: bool, is_inplace: bool) -> FieldResult<FindReplaceCommand> {
        use names::{Generator, Name};
        let mut generator = Generator::with_naming(Name::Numbered);
        match generator.next() {
            Some(phrase) => {
                let conn = context.pool.get().unwrap();
                let command = generate_command(&find, &replace, &is_global, &is_inplace);
                let frc = crate::models::FindReplaceCommand {
                    find,
                    replace,
                    command,
                    is_global,
                    is_inplace,
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