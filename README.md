Runtime Configurator
===

Painless runtime configuration for Node.js applications.

Features:

- fills in configuration values with `.js` and `.json` files,
  environment variables and command line arguments,
- validates configuration values with declared validators,
- supports any kind of data types: booleans, numbers, strings,
  objects and arrays,
- freezes resolved configuration values for mistake proofing
  (according to *Poka-yoke* principle),
- prints configuration as table into command line
  (useful to generate help commands).

## Installation

```
$ npm install --save runtime-configurator
```

## Usage

1\. Import what you need

```
import {
    ConfigurationBagInterface,
    ConfigurationBag,
    ConfigurationItemInterface,
    ConfigurationItem,

    ConfigurationValidatorInterface,
    ArrayValidator,
    BooleanValidator,
    EnumerableValidator,
    NumberValidator,
    ObjectValidator,
    RegularExpressionValidator,
    StringValidator,

    ConfigurationSourceInterface,
    CommandLineSource,
    DirectorySource,
    EnvironmentVariablesSource,
    FileSource,

    ConfigurationPrinterInterface,
    CommandLinePrinter
} from "runtime-configurator";
```

2\. Declare configuration items

```
const items: ConfigurationItemInterface[] = [
    new ConfigurationItem(
        "httpServer.port",
        "Port to be exposed by HTTP server.",
        8080,
        [
            new NumberValidator(true, 1024, 49151)
        ]
    )
];
```

**Note: use camel case names and dots as separator.**
This library requires that convention to properly resolve
env vars and cli args.

3\. Declare configuration sources

```
const sources: ConfigurationSourceInterface[] = [
    new DirectorySource("/etc/app", false),
    new FileSource("/etc/app.json", false),
    new EnvironmentVariablesSource("APP"),
    new CommandLineSource("override")
];
```

**Note: the order matters here.** Every source might
override values resolved by previous sources.
It is recommended to place env vars and cli args
at the bottom of the list.

4\. Create a configuration bag

```
const configuration: ConfigurationBagInterface = 
    new ConfigurationBag(items, sources);
```

5\. Get value from the configuration bag

```
configuration.get("httpServer.port")
> 8080
```

Btw. now you are able to override `httpServer.port` value with:
                                
- any `.js` and `.json` file inside `/etc/app` directory,
- `/etc/app.json` file,
- following environment variables:
    - `APP__HTTP_SERVER__PORT=1234`,
    - `APP__HTTP_SERVER='{"port":1234}'`,
    - `APP='{"httpServer":{"port":1234}}'`,
- following command line arguments:
    - `--override=httpServer.port=1234`,
    - `--override=httpServer='{"port":1234}'`,
    - `--override='{"httpServer":{"port":1234}}'`.

Enjoy!

## Examples

There are two runnable examples. One with
[pure JavaScript](https://github.com/damlys/node-runtime-configurator/tree/master/examples/js-app)
and the second one with
[TypeScript](https://github.com/damlys/node-runtime-configurator/tree/master/examples/ts-app).

## Development

```
$ git clone git@github.com:damlys/node-runtime-configurator.git
$ cd node-runtime-configurator/
$ npm install
$ npm run build
$ npm run lint(-fix)
$ npm run test(-coverage|-watch)
```
