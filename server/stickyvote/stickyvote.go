package stickyvote

import (
	"errors"
	"github.com/graph-gophers/graphql-go"
)

var topicData = make(map[graphql.ID]*topic)

func init() {
	CHOICE_LEFT := "LEFT"
	CHOICE_RIGHT := "RIGHT"
	var topics = []*topic{
		{ID: "0", Left: "Bernie", Right: "Trump", HasVoted: &CHOICE_LEFT},
		{ID: "1", Left: "F150", Right: "CyberTruck", HasVoted: &CHOICE_RIGHT},
		{ID: "2", Left: "Einstein", Right: "Euler", HasVoted: &CHOICE_LEFT},
	}

	for _, d := range topics {
		topicData[d.ID] = d
	}
}

type Resolver struct{}

func (r *Resolver) Vote(args struct {
	Topic  graphql.ID
	Choice string
}) (*graphql.ID, error) {
	//check if topic exists
	if val := topicData[args.Topic]; val != nil {
		//yes -> update topic to reflect user's vote
		val.HasVoted = &args.Choice
		return &args.Topic, nil
	}

	//no -> return nil
	return nil, errors.New("no topic found")
}

func (r *Resolver) GetTopics() ([]*topicResolver, error) {
	out := make([]*topicResolver, 0, len(topicData))
	for _, value := range topicData {
		out = append(out, &topicResolver{data: value})
	}
	return out, nil
	//return nil, errors.New("This is not the droid you are looking for")

}

func (r *Resolver) GetDemoTopic() (*topicResolver, error) {
	if val := topicData["0"]; val != nil {
		return &topicResolver{data: val}, nil
	}
	return nil, errors.New("This is not the droid you are looking for")
}
