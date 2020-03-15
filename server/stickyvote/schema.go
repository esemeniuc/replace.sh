package stickyvote

var Schema = `
	schema {
		query: Query
		mutation: Mutation
	}
	type Query {
		getTopics(): [Topic!]!
		getDemoTopic(): Topic!
	}
	type Mutation {
		vote(topic: ID!, choice: Choice!): ID
	}
	type Topic {
		id: ID!
		left: String!
		right: String!
		hasVoted: Choice
	}
	enum Choice {
		LEFT
		RIGHT
	}	
`
