Stanchion
========
![travis-badge](https://travis-ci.org/alixander/Stanchion.svg?branch=master)

Add priorities to your web app's network requests.

![Diagram](https://github.com/alixander/Stanchion/blob/master/docs/stanchion_diagram.png)

### Installation

```
npm install --save stanchion
```

or

```
yarn add stanchion
```

### What it's solving

There exists ceilings on maximum number of requests implemented by browsers [[1](http://www.browserscope.org/?category=network)]. But the browser's network request queue operates on a first-in-first-out order. Stanchion is for adding an application-aware network queue where requests are dispatched based on the priority they are assigned.

### Why should you use this

This is of benefit for web apps that can make a large number of network calls at any given time. A large number is one that exceeds the maximum concurrent requests able to be made by any of the browsers your app supports.

Not every network call is equal when it comes to delivering responsive user experience. For example, network requests for which UI elements wait on should take priority over calls to persist some data to the back-end, which should take priority over calls to analytics-collection. Maybe some of these calls are made periodically at intervals and some are made in response to events. Instead of managing ordering at a micro level, Stanchion takes a simple approach of assigning priorities.  

### Demo use case

These are some gifs of images loading on Chrome browser. On the server, every image response is delayed for 2000ms from when the request is received. Since the number of max parallel requests is 6, it takes the first 6 images and always loads those as first batch. When those are in flight, the rest of the images would've been processed and queued up, so priority comes into consideration for images past the 6th. Note on the gifs: I didn't start recording at the same times, so the gif start isn't representative of a baseline for any timing.

#### Default (without using library)

![Gif of without lib](https://github.com/alixander/Stanchion/blob/master/docs/without_library.gif)

#### Using Stanchion prioritizing lower numbers

![Gif of with lowest priority](https://github.com/alixander/Stanchion/blob/master/docs/priority_lowest.gif)

#### Using Stanchion prioritizing higher numbers

![Gif of with highest priority](https://github.com/alixander/Stanchion/blob/master/docs/priority_highest.gif)

In that last gif, here's the logging info for what's happening. The first 6 queued are dispatched right away, and the rest are held in queue until a response comes back. When responses are received and more requests can be dispatched, the highest priority requests in the queue are dispatched first.

![Logging info console output](https://github.com/alixander/Stanchion/blob/master/docs/console.png)

### API

`initialize(config)`

- `config`: Object - a list of options to initialize with
    - `logger`: Function - [Optional] this is the callback used for logging. It will be called with parameter object of the format `{logLevel: ..., message: ...}`.
    - `maxOpenConnections`: Number - [Optional] override the library's determination of the number of open connections a browser supports in total. Almost certainly don't need this.
    - `maxOpenConnectionsPerHostname`: Number - [Optional] override the library's determination of the number of open connections a browser supports per hostname. Almost certainly don't need this.

`queue(requestConfig)`

- `requestConfig`: Object - a list of options for the network request
    - `task`: Promise - a Promise which is expected to make the request when called and resolved when finished
    - `priority`: Number - the priority of this request. Defaults to 1, which makes the queue just FIFO.
    - `url`: String - [Optional] the url to which you are making the request. You should pass this in if you have network requests going to different hostnames, otherwise it treats every request as if they were going to the same hostname. Browsers have different maximum open connections per hostname vs open connections in total.
    - `onSuccess`: Function - [Optional] the callback for after `task` is resolved
    - `onError`: Function - [Optional] the callback for if `task` is rejected
