export const customLogger = {
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
      ignore:
        'pid,hostname,req.id,req.headers.user-agent,req.headers.connection,req.headers.sec-ch-ua-platform,req.headers.sec-ch-ua,req.headers.sec-ch-ua-mobile,req.remoteAddress,req.remotePort,res.headers',
    },
  },
};
