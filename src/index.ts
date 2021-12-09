import * as inquirer from "inquirer";
import chalk from "chalk";
import { getAvailableTimeSlotsOnDay, Options } from "./domain/quickTest";
import { getPersonalInfoOrInquire, PersonalInfo } from "./domain/personalInfo";
import { bookAppointment } from "./domain/bookAppointment";
import { continueOrQuit } from "./domain/postBooking";
import { getSelectedTimeSlots } from "./domain/getTimeSlots";
import { getAppointmentDate } from "./domain/getDate";

inquirer.registerPrompt("date", require("inquirer-date-prompt"));
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

enum Step {
  SelectDate,
  SelectTimeSlot,
  GetOrFillPersonalInfo,
  Booking,
  PostBooking,
}

type AppState = {
  selectedDate: number | null;
  selectedSlot: Options | null;
  availableSlots: Options[];
  personalInfo: PersonalInfo | null;
};

const DEFAULT_STATE: AppState = {
  selectedDate: null,
  selectedSlot: null,
  availableSlots: [],
  personalInfo: null,
};

(async () => {
  let step: Step = Step.SelectDate;
  let state: AppState = DEFAULT_STATE;

  while (true) {
    switch (step) {
      case Step.SelectDate: {
        const timestamp = await getAppointmentDate();
        state.selectedDate = timestamp;
        step = Step.SelectTimeSlot;
        break;
      }

      case Step.SelectTimeSlot: {
        state.availableSlots = await getAvailableTimeSlotsOnDay(
          state.selectedDate!
        );
        state.selectedSlot = await getSelectedTimeSlots(state.availableSlots);
        step = Step.GetOrFillPersonalInfo;
        break;
      }

      case Step.GetOrFillPersonalInfo: {
        state.personalInfo = await getPersonalInfoOrInquire();
        step = Step.Booking;
        break;
      }

      case Step.Booking: {
        if (!state.personalInfo || !state.selectedSlot) {
          console.log(
            chalk.bold.red(
              "Unexpected failure: Missing personal info / selected slot right before booking. Aborting."
            )
          );
          process.exit(1);
        }
        await bookAppointment({
          info: state.personalInfo,
          slot: state.selectedSlot,
        });

        step = Step.PostBooking;
        break;
      }

      case Step.PostBooking: {
        const shouldContinue = await continueOrQuit();
        if (shouldContinue) {
          step = Step.SelectDate;
          state = DEFAULT_STATE;
          break;
        }
        console.log(chalk.blue("Exiting..."));
        process.exit(0);
      }
      default:
        process.exit(0);
    }
  }
})();
