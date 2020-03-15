package stickyvote

import	"github.com/graph-gophers/graphql-go"

type choice *string

type topic struct {
	ID       graphql.ID
	Left     string
	Right    string
	HasVoted choice //TODO check if this is correct
}

type topicResolver struct {
	data *topic
}

func (r *topicResolver) ID() graphql.ID {
	return r.data.ID
}

func (r *topicResolver) Left() string {
	return r.data.Left
}
func (r *topicResolver) Right() string {
	return r.data.Right
}
func (r *topicResolver) HasVoted() choice {
	return r.data.HasVoted
}
