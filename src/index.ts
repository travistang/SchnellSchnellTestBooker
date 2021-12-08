import * as inquirer from "inquirer";
import chalk from 'chalk';
import { getAvailableTimeSlotsOnDay, Options } from "./domain/quickTest";
import { getPersonalInfoOrInquire } from "./domain/personalInfo";

inquirer.registerPrompt("date", require("inquirer-date-prompt"));
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

async function getTimestamp() {
  const { timestamp } = await inquirer.prompt({
    // @ts-ignore
    type: "date",
    name: "timestamp",
    message: "When do you want to get a schnelltest?",
    default: new Date(),
    transformer: (s) => chalk.bold.green(s),
    locale: "en-US",
    format: { weekday: "short", month: "short", hour: undefined, minute: undefined },
    clearable: true,
  });
  return timestamp;
}

function slotToString(slot: Options, index: number): string {
  return `${index + 1}. (${slot.freeSlots} free) [${slot.calendarName}]:  ${slot.startTime} - ${slot.endTime}`;
}
async function getSelectedTimeSlots(timeSlots: Options[]): Promise<{ slot: string, timeSlots: Options[] }> {
  const { slot } = await inquirer.prompt({
    // @ts-ignore
    type: "autocomplete",
    name: "slot",
    message: "Select a timeslot below...",
    source: async (_: any, input: string) => {
      if (!input) return timeSlots.map(slotToString);
      return timeSlots
        .map(slotToString)
        .filter((timeString) => timeString.includes(input));
    }
  });
  return {slot, timeSlots};
};

getTimestamp()
  .then(getAvailableTimeSlotsOnDay)
  .then(getSelectedTimeSlots)
  .then(getPersonalInfoOrInquire)
  .then(console.log)