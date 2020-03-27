import {getEventById} from "../DB/queries/event.js";
import RedisJSONCache from "../redis/redisJSONCache.js";
import redisClient from "../redis/redisClient.js";

const onMiss = async eventId => getEventById(eventId);

const CacheType = "socket.io/EventId";
const eventCache = new RedisJSONCache(CacheType, onMiss, redisClient);

export default eventCache;
