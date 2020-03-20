#[derive(Queryable, Debug)]
pub struct FindReplaceCommand {
    pub id: i32,
    pub find: String,
    pub replace: String,
    pub command: String,
    pub shortcode: String,
}