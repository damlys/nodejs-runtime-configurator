import { join } from "path";
import {
    ArrayValidator,
    BooleanValidator,
    CommandLinePrinter,
    CommandLineSource,
    ConfigurationBag,
    ConfigurationBagInterface,
    ConfigurationItem,
    DirectorySource,
    EnvironmentVariablesSource,
    FileSource,
    NumberValidator,
    StringValidator,
} from "../../src";

const configuration: ConfigurationBagInterface = new ConfigurationBag(
    [
        new ConfigurationItem(
            "dataStorage.host",
            "MySQL host.",
            "127.0.0.1",
            [
                new StringValidator(),
                // ad-hoc validator:
                {
                    validate(value: any): string[] {
                        if (value === "0.0.0.0") {
                            return ['Value can not equal "0.0.0.0".'];
                        }
                        return [];
                    },
                },
            ],
        ),
        new ConfigurationItem(
            "dataStorage.port",
            "MySQL port.",
            3306,
            [
                new NumberValidator(true, 0, 65535),
            ],
        ),
        new ConfigurationItem(
            "dataStorage.username",
            "MySQL username.",
            "user0",
            [
                new StringValidator(),
            ],
        ),
        new ConfigurationItem(
            "dataStorage.password",
            "MySQL password.",
            "",
            [
                new StringValidator(8),
            ],
        ),
        new ConfigurationItem(
            "dataStorage.databaseName",
            "MySQL database name.",
            "db0",
            [
                new StringValidator(),
            ],
        ),
        new ConfigurationItem(
            "dataStorage.autoReconnect",
            "Enables or disables auto reconnect.",
            false,
            [
                new BooleanValidator(),
            ],
        ),
        new ConfigurationItem(
            "mailer.replyToAddresses",
            "SMTP Reply-To header value.",
            ["support@example.tld", "admin@example.tld"],
            [
                new ArrayValidator(new StringValidator(), 1, 10),
            ],
        ),
    ],
    [
        new DirectorySource(join(__dirname, "/configs")),
        new FileSource(join(__dirname, "/config.json")),
        new DirectorySource("/etc/app", false),
        new FileSource("/etc/app.json", false),
        new EnvironmentVariablesSource("APP"),
        new CommandLineSource("override"),
    ],
);

if (process.argv.includes("--print-config")) {
    configuration.print(new CommandLinePrinter());
    process.exit(0);
}

// tslint:disable-next-line:no-console
console.log("Doing app's stuff...");
