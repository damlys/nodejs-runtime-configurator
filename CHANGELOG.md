# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Do not use `process.argv`, `process.env` and `process.stdout.columns` as default parameters values.
- Rename `CommandLineSource` to `CommandLineArgumentsSource`.

### Fixed

- Turn on TypeScript `esModuleInterop` option.

## [1.2.0] - 2019-10-22

### Added

- Support Node v6 and v8.

### Changed

- Allow to resolve only literal objects.

## [1.1.0] - 2019-10-20

### Added

- Object validator.

## [1.0.2] - 2019-10-19

### Added

- Handle object notation within top-level command line arguments and environment variables.
- Enumerable validator.

### Changed

- Command line source throws an error on invalid name or value.

## [1.0.1] - 2019-10-18

### Added

- Regular expression validator.

### Changed

- Rename `PrinterInterface` to `ConfigurationPrinterInterface`.

## [1.0.0] - 2019-10-17

Initial version.
