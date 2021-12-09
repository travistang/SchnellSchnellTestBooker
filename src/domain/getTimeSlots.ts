import inquirer from "inquirer";
import { Options } from "./quickTest";

function slotToString(slot: Options, index: number): string {
  return `${index}. (${slot.freeSlots} free) [${slot.calendarName}]:  ${slot.startTime} - ${slot.endTime}`;
}

export async function getSelectedTimeSlots(
  timeSlots: Options[]
): Promise<Options> {
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
    },
  });
  const [slotIndex] = slot.match(/^[0-9]+/);
  return timeSlots[slotIndex];
}
