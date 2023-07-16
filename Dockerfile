FROM denoland/deno
WORKDIR /app
ADD . .
CMD deno task start
