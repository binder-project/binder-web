# binder-web

Client-side web app for managing binder deployments.

## install

```
npm install binder-web
```

## development

For developing, you need to specify a binder server to run the web app against. The easiest option is to use the beta binder server at `beta.mybinder.org`. To do that, open the file `~/.binder/web.conf` and provide the following configuration

```json
{
  "port": 3000,
  "build": {
    "host": "beta.mybinder.org",
    "port": 8082
  },
  "registry": {
    "host": "beta.mybinder.org",
    "port": 8082
  },
  "deploy": {
    "host": "beta.mybinder.org",
    "port": 8084
  }
}
```

And provide an API token by setting the environmental variable

```
export BINDER_API_KEY=***
```

Then start the web app with

```
npm run start:debug
```