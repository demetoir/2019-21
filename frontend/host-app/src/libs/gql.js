import {gql} from "apollo-boost";

const queryEventsByHost = gql`
    query {
        init {
            events {
                id
                eventCode
                eventName
                startAt
                endAt
                moderationOption
                replyOption
                HashTags {
                    id
                    name
                    EventId
                }
            }
            host {
                oauthId
                id
                name
                image
                email
            }
        }
    }
`;


const mutateCreateEvent = gql`
    mutation Query($info: EventInfo!) {
        createEvent(info: $info) {
            id
            eventCode
            eventName
            moderationOption
            replyOption
            endAt
            startAt
            HostId
        }
    }
`;


const mutateCreateHashTags = gql`
    mutation Mutation($hashTags: [HashTagInput]!) {
        createHashTags(hashTags: $hashTags) {
            id
        }
    }
`;


const mutateUpdateEvent = gql`
    mutation Mutation($event: EventUpdate!) {
        updateEvent(event: $event) {
            id
            eventCode
            eventName
            moderationOption
            replyOption
            endAt
            startAt
            HostId
        }
    }
`;

export {
	queryEventsByHost,
	mutateCreateEvent,
	mutateUpdateEvent,
	mutateCreateHashTags,
};
