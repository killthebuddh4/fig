## Overview

Fig is React hooks for [xmtp](https://xmtp.org) and [quiver](https://github.com/killthebuddh4/quiver). Use Fig to build secure, permissionless, open applications.

## Features

`fig` is hooks for...

**XMTP**

The [xmtp-js](https://github.com/xmtp/xmtp-js) SDK allows you to send, receive, and subscribe to XMTP conversations. `fig` provides a set of ergonomic hooks for working directly with `xmtp-js`.

**quiver**

`fig` provides hooks to access any live `quiver` backend but works best when paired with a published typesafe API. Click [here](https://github.com/killthebuddh4/quiver) to learn more about `quiver`.

**canopy**

Canopy is a permissionless key-value server for XMTP. You can use `canopy` to build open data protocols. `fig` provides hooks for Canopy's entire API.

**txt**

[txt](../../apps/canopy/) is a completely open, realtime social network powered by XMTP. With `fig` you can add social networking features to your app with just a few lines of code.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Contents](#contents)
- [Documentation](#documentation)
    - [Quick Start](#quick-start)
    - [Usage](#usage)
    - [API Reference](#api-reference)
- [Support](#support)
- [Community](#community)
- [Contributing](#contributing)
- [Sponsors](#sponsors)
- [Authors](#authors)
- [License](#license)
- [Roadmap (\& Notes)](#roadmap--notes)

## Documentation

#### Quick Start

**TODO** More here.

```bash
npm install @killthebuddh4/fig
```

#### Usage

We've "inlined" basic working use cases with each public hook. You can see each use case live at `https://fig.banyan.sh/examples/name-of-hook`.

**TODO** List the API here.

#### API Reference

**TODO** For each hook, it's signature and basic usage, notes, and gotchas.

## Support

The best place to get real-time support is the `#banyan` channel in [Discord](https://discord.gg/wG9rEmw8). You'll get extra special attention and tons of kudos 🎉 if you also [open an issue](https://github.com/killthebuddh4/issues/new).

## Community

- Join us on [Discord](https://discord.gg/wG9rEmw8) 💬
- Follow [Achilles](https://twitter.com/killthebuddh4) on Twitter for project updates 🤝

## Contributing

If you're interested in contributing, please read the [contributing
docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Sponsors

_You can be the first ❤️!_

## Authors

- [Achilles Schmelzer](https://twitter.com/killthebuddha_)

## License

[MIT](/LICENSE) License

## Roadmap (& Notes)

- stateful worker hooks
- action worker hooks
- unifying hooks
  - useLogin
  - useConversation
  - useMessages
  - useInbox (TODO)
- helper hooks
  - useCreateConversation
  - useSendMessage
  - ...
- brpc hooks
- banyan hooks
- ...
