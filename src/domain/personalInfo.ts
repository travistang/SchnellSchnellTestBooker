import inquirer from "inquirer";
import fs from 'fs';
import path from 'path';
import chalk from "chalk";
import { format } from "date-fns";

const INFO_PATH = path.join(__dirname + '/info.json');
export type PersonalInfo = {
  firstName: string,
  lastName: string,
  birthday: string;
  address: string;
  plz: string;
  place: string;
  country: string;
  phoneNumber: string;
  email: string;
}
export type GetPersonalInfoResultType = {
  slot: string,
  info: PersonalInfo,
}
export async function getPersonalInfoOrInquire({
  slot,
}: {
  slot: string;
}): Promise<GetPersonalInfoResultType | null> {
  if (!fs.existsSync(INFO_PATH)) {
    console.log(
      chalk.green(
        `Since your info isn't saved (are you using this tool for the first time :) ?) Your personal info will be asked and saved in ${chalk.blueBright(
          INFO_PATH
        )} for future bookings. Please answer the questions below...`
      )
    );
    const {
      firstName,
      lastName,
      birthday,
      address,
      plz,
      place,
      phoneNumber,
      email,
    } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Your first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "Your last name?",
      },
      {
        type: "date",
        name: "birthday",
        message: "Your birthday?",
        format: { hour: undefined, minute: undefined },
      },
      {
        type: "input",
        name: "address",
        message:
          "Your address (street) and street number? (e.g. Erika-Mann-Str. 62-66)",
      },
      {
        type: "string",
        name: "plz",
        message: "PLZ? (e.g. 80636)",
        validate: (input) => new RegExp(/^[0-9]{5}$/).test(input),
      },
      {
        type: "string",
        name: "place",
        message: "City you live in? (default: Munich)",
        default: "Munich",
      },
      {
        type: "string",
        name: "phoneNumber",
        message:
          "Your phone number? (e.g. 012 3456789) (Do not start with +49!)",
        validate: (input) => new RegExp(/^0[0-9 ]+$/).test(input),
      },
      {
        type: "string",
        name: "email",
        message: "Your Email?",
        validate: (input) => new RegExp(/^.+@.+\..+$/).test(input),
      },
    ]);
    const info = {
      firstName,
      lastName,
      birthday: format(birthday, "yyyy-MM-dd"),
      country: "Deutschland",
      place,
      address,
      plz,
      phoneNumber,
      email,
    };
    fs.writeFileSync(INFO_PATH, JSON.stringify(info));
    return { info, slot };
  }

  try {
    const info: PersonalInfo = JSON.parse(
      fs.readFileSync(INFO_PATH).toString()
    );
    console.log(chalk.green("Using saved personal info for booking:"));
    console.log(chalk.green(JSON.stringify(info, null, 3)));
    return { info, slot };
  } catch (e) {
    console.log(
      chalk.red(
        `Error retrieving personal info from ${INFO_PATH}: ${
          (e as Error).message
        }`
      )
    );
    return null;
  }
}