## Overview

Fig is React hooks for [xmtp](https://xmtp.org). Use Fig to build secure, permissionless, open applications.

## Features

Fig provides everything you need to build a complete application on top of XMTP:

- useAuth
- useMessages
- useStream
- useTopic
- useFunction
- useRouter
- useKv (coming soon!)
- useSql (coming soon!)

## Contents

- [Overview](#overview)
- [Features](#features)
- [Contents](#contents)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Built with Fig](#built-with-fig)
- [Support](#support)
- [Community](#community)
- [Contributing](#contributing)
- [Sponsors](#sponsors)
- [Authors](#authors)
- [License](#license)
- [Roadmap](#roadmap)
- [Notes](#notes)

## Quick Start

```bash
npm install @killthebuddh4/fig
```

## API Reference

- useAuth
- useMessages
- useStream
- useTopic
- useFunction
- useRouter

## Built with Fig

- [shh](https://sh.ktb.pub) is private, ephemeral group chat.
- [txt](https://txt.ktb.pub) is an experimental, text-based, realtime social network
- More coming soon!

## Support

The best place to get real-time support is the `#fig` channel in [Discord](https://discord.gg/wG9rEmw8) or by sending Achilles a DM on [X](https://x.com/killthebuddha_). Also, please don't hesitate to [open an issue](https://github.com/killthebuddh4/fig/issues/new).

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

## Roadmap

## Notes

Quiver API

```JavaScript

const quiver = createQuiver();

quiver.use();

const routerA = createRouter();

routerA.use();

routerA.use();

const routerB = createRouter();

routerB.use();

quiver.router(a);

quiver.router(b);

quiver.start();

// later
us to talk to Quiver through (and about) specific router instances.

router.detach();

router.attach();


```
