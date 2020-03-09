const helloResolver = name => [{world: "hello"}];

export default {
	Query: {
		hello: (_, {name}) => helloResolver(name),
	},
};
