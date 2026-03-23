FROM mcr.microsoft.com/playwright:v1.58.2-jammy
# Install build tools required by aws-lambda-ric
RUN apt-get update && \
    apt-get install -y \
      cmake \
      build-essential \
      autoconf \
      automake \
      libtool \
    && rm -rf /var/lib/apt/lists/*
# Install AWS Lambda Runtime Interface Client
RUN npm install -g aws-lambda-ric

# Create Lambda task directory
WORKDIR /var/task

# Copy package files first
COPY package*.json ./

RUN npx playwright install-deps

RUN npm install

# Copy app code
COPY . .

ENV HOME=/tmp
ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV npm_config_loglevel=error
# Set Lambda entrypoint
ENTRYPOINT ["/usr/bin/aws-lambda-ric"]
CMD ["handler.handler"]
