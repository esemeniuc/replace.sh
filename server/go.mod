module replace.sh

go 1.14

require (
	github.com/graph-gophers/graphql-go v0.0.0-20200309224638-dae41bde9ef9
	stickyvote v0.0.0-00010101000000-000000000000
)

replace stickyvote => ./stickyvote
