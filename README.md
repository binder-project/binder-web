## :dash: :dash: **The Binder Project is moving to a [new repo](https://github.com/jupyterhub/binderhub).** :dash: :dash:

:books: Same functionality. Better performance for you. :books:

Over the past few months, we've been improving Binder's architecture and infrastructure. We're retiring this repo as it will no longer be actively developed. Future development will occur under the [JupyterHub](https://github.com/jupyterhub/) organization.

* All development of the Binder technology will occur in the [binderhub repo](https://github.com/jupyterhub/binderhub)
* Documentation for *users* will occur in the [jupyterhub binder repo](https://github.com/jupyterhub/binder) 
* All conversations and chat for users will occur in the [jupyterhub binder gitter channel](https://gitter.im/jupyterhub/binder)

Thanks for updating your bookmarked links.

## :dash: :dash: **The Binder Project is moving to a [new repo](https://github.com/jupyterhub/binderhub).** :dash: :dash:

---

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
