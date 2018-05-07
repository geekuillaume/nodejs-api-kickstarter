# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:10 AS builder

RUN mkdir -p /opt/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

FROM node:10-slim AS runner
COPY --from=builder /opt /opt

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

ENV NODE_ENV $NODE_ENV

# Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK CMD curl -fs http://localhost:$PORT/healthz || exit 1

# install dependencies first, in a different location for easier app bind mounting for local development
ENV PATH /opt/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR /opt/app
COPY . /opt/app

CMD [ "npm", "start" ]