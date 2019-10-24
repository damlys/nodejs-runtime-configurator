Runtime Configurator
===

[![Build Status](https://img.shields.io/travis/damlys/nodejs-runtime-configurator/master?style=flat-square)](https://travis-ci.org/damlys/nodejs-runtime-configurator)
[![Test Coverage](https://img.shields.io/coveralls/github/damlys/nodejs-runtime-configurator/master?style=flat-square)](https://coveralls.io/github/damlys/nodejs-runtime-configurator)
[![NPM Version](https://img.shields.io/npm/v/runtime-configurator?style=flat-square)](https://www.npmjs.com/package/runtime-configurator)
[![License](https://img.shields.io/github/license/damlys/nodejs-runtime-configurator?style=flat-square)](https://github.com/damlys/nodejs-runtime-configurator/blob/master/LICENSE.md)

Painless runtime configuration for Node.js applications.

<p align="center">
  <img src="https://raw.githubusercontent.com/damlys/nodejs-runtime-configurator/develop/docs/diagram.svg?sanitize=true">
</p>

Features:

- fills in configuration values with `.js` and `.json` files,
  environment variables and command line arguments,
- validates configuration values with declared validators,
- supports any kind of data types: booleans, numbers, strings,
  objects and arrays,
- freezes resolved configuration values for mistake proofing
  (according to *poka-yoke* principle),
- does not collide with most popular CLI tools like 
  [Commander.js](https://www.npmjs.com/package/commander),
  [oclif](https://www.npmjs.com/package/oclif)
  or [Yargs](https://www.npmjs.com/package/yargs),
- prints configuration as table into standard output
  (useful to generate help commands),
- **production ready!**

## Table of contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [Validators](#validators)
1. [Examples](#examples)
1. [FAQ](#faq)
1. [Development](#development)

## Installation

```
$ npm install --save runtime-configurator
```

## Usage

1\. Import what you need

```typescript
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
    CommandLineArgumentsSource,
    DirectorySource,
    EnvironmentVariablesSource,
    FileSource,

    ConfigurationPrinterInterface,
    StandardOutputPrinter
} from "runtime-configurator";
```

2\. Declare configuration items

```typescript
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

```typescript
const sources: ConfigurationSourceInterface[] = [
    new DirectorySource("/etc/app", false),
    new FileSource("/etc/app.json", false),

    new DirectorySource(path.join(os.homedir(), ".app"), false),
    new FileSource(path.join(os.homedir(), ".app.json"), false),

    new EnvironmentVariablesSource(process.env, "APP"),
    new CommandLineArgumentsSource(process.argv, "override")
];
```

**Note: the order matters here.** Every source might
override values resolved by previous sources.
It is recommended to place env vars and cli args
at the bottom of the list.

4\. Create a configuration bag

```typescript
const configuration: ConfigurationBagInterface =
    new ConfigurationBag(items, sources);
```

5\. Get value from the configuration bag

```typescript
const port: number =
    configuration.get("httpServer.port") as number;
```

Btw. now you are able to override `httpServer.port` value with:

- any `.js` and `.json` file inside `/etc/app` directory,
- `/etc/app.json` file,
- any `.js` and `.json` file inside `/home/<username>/.app` directory,
- `/home/<username>/.app.json` file,
- following environment variables:
    - `APP__HTTP_SERVER__PORT=1234`,
    - `APP__HTTP_SERVER='{"port":1234}'`,
    - `APP='{"httpServer":{"port":1234}}'`,
- following command line arguments:
    - `--override=http-server.port=1234`,
    - `--override=http-server='{"port":1234}'`,
    - `--override='{"httpServer":{"port":1234}}'`.

Enjoy!

## Validators

Every configuration item can be validated
with one or more validators. Example below
shows how to ensure that `mailer.enabled`
will always be a boolean.

```typescript
const item: ConfigurationItemInterface = new ConfigurationItem(
    "mailer.enabled",
    "Enables or disables emails sending.",
    true,
    [
        new BooleanValidator()
    ]
);
```

###### Boolean validator

```typescript
new BooleanValidator()
```

Just checks if value is a boolean.

###### Number validator

```typescript
new NumberValidator(true, 1, 10)
```

Checks if value is an integer, bigger than or equal 1
and smaller than or equal 10.

###### String validator

```typescript
new StringValidator(5, 10)
```

Checks if value is a string with minimum length
of 5 and maximum length of 10.

###### Regular expression validator

```typescript
new RegularExpressionValidator(/.*/)
```

Checks if value is a string and passes
regular expression test.

###### Enumerable validator

```typescript
new EnumerableValidator([null, true, 1, "foo"])
```

Checks if value equals `null`, `true`, `1` or `"foo"`.

###### Object validator

```typescript
new ObjectValidator({ foo: new BooleanValidator() })
```

Checks if value is an object and it's `foo` property
is a boolean.

###### Array validator

```typescript
new ArrayValidator(new BooleanValidator(), 1, 3)
```

Checks if value is an array of booleans with minimum
length of 1 and maximum length of 3.

###### Ad-hoc validator

```typescript
{
    validate(value: any): string[] {
        if (value === "0.0.0.0") {
            return ['Value can not equal "0.0.0.0".'];
        }
        return [];
    },
}
```

This specific validator checks if value does not
equal `"0.0.0.0"`.

## Examples

There are two runnable examples. One with
[pure JavaScript](https://github.com/damlys/nodejs-runtime-configurator/tree/master/examples/js-app)
and the second one with
[TypeScript](https://github.com/damlys/nodejs-runtime-configurator/tree/master/examples/ts-app).

## FAQ

###### What is a runtime configuration?

Runtime configuration is a
set of values which vary between application deployments,
aka. values which we do not know during application development.

See more at [The Twelve-Factor App](https://12factor.net/config).

## Development

```
$ git clone git@github.com:damlys/nodejs-runtime-configurator.git
$ cd nodejs-runtime-configurator/
$ npm audit
$ npm install
$ npm run build
$ npm run lint(-fix)
$ npm run test(-coverage|-watch)
```
