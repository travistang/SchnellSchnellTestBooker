import chalk from "chalk";
import inquirer from "inquirer";

export async function getAppointmentDate() {
  const { timestamp } = await inquirer.prompt({
    // @ts-ignore
    type: "date",
    name: "timestamp",
    message: "When do you want to get a schnelltest?",
    default: new Date(),
    transformer: (s) => chalk.bold.green(s),
    locale: "en-US",
    format: {
      weekday: "short",
      month: "short",
      hour: undefined,
      minute: undefined,
    },
    clearable: true,
  });
  return timestamp;
}
