# deco-server

deco-server is [decofun]('https://github.com/davidmarkclements/decofun') as a service (DFaaS).

It's a web service that names anonymous functions in a specified JavaScript file, 
according to their surrounding context (e.g. is it returned from a function?) 
and line number.

This can be very useful when debugging, particularly if a stack trace has been lost
due to a next tick, and all you have to look at is piles of anonymous functions.

## decofun.herokuapp.com

deco-server is currently running at http://decofun.herokuapp.com/, 
the below examples use this address for instant demo satisfation, 
but you can also install deco-server and run locally.

## Usage

### Remote scripts

Say we have the following script tag

```html
<script src='http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js'></script>
```

We simply prefix the src with a deco server, like so

```html
<script src='http://decofun.herokuapp.com/?addr=http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js'></script>
```

### Local scripts

Locally hosted scripts can be uploaded to `deco-server` where they 
are transformed and cached for 8 hours. 

We can upload a script with curl like so

```sh
curl -F filedata=@my-script.js http://decofun.herokuapp.com
```
When the upload is complete, the POST response will be a ':id/:filename',
something like the following:

```sh
rsxnyf/my-script.js
```

Once we have this we can alter our script tag, say we have a script tag like this

```html
<script src='/my-script.js'></script>
```

We simply change it to

```html
<script src='http://decofun.herokuapp.com/rsxnyf/my-script.js'></script>
```

## Hosting locally

To run deco-server locally

```
sudo npm i -g deco-server
deco-server
```

This will start a server on port 8080. To specifiy the port do

```
PORT=9999 deco-server
```




 
