import inquirer from "inquirer";

export async function continueOrQuit() {
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "continue",
    message: "Booking another appointment?",
    default: true,
  });
  return answer.continue;
}
