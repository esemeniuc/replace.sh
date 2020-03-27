table! {
    find_replace_commands (id) {
        id -> Integer,
        find -> Text,
        replace -> Text,
        command -> Text,
        is_inplace -> Bool,
        is_global -> Bool,
        shortcode -> Text,
    }
}
