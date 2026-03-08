import pino from "pino";
import pinoHttp from "pino-http";

const env = process.env.NODE_ENV || "development";

export const logger = pino({
  level: env === "development" ? "debug" : "info",
  transport:
    env === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

export const httpLogger = pinoHttp({
  logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customProps: (_req, _res) => ({
    context: "http",
  }),
});
