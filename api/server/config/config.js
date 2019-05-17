var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = '';
    process.env.REDIS_URI = '';
    process.env.REDIS_PORT = 6379;
    process.env.AWS_KEY = '';
    process.env.AWS_SECRET = '';
    process.env.CF_KEY = '';

} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = '';
    process.env.REDIS_URI = '';
    process.env.REDIS_PORT = 6379;
    process.env.AWS_KEY = '';
    process.env.AWS_SECRET = '';
    process.env.CF_KEY = '';
}
