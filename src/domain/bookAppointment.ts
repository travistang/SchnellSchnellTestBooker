import axios from "axios";
import chalk from "chalk";
import { PersonalInfo } from "./personalInfo";
import { Options } from "./quickTest";

export const bookAppointment = async ({
  info,
  slot,
}: {
  info: PersonalInfo;
  slot: Options;
}) => {
  const url = "https://www.etermin.net/api/appointment";
  const phoneNumber = info.phoneNumber.replace(/^0/, "+49").replace(/ /g, "");
  const escape = encodeURIComponent;
  const searchParams = new URLSearchParams(
    "language=de&bookingtype=Internet&bookingurl=https%3A%2F%2Fwww.schnelltest-zentrum.de%2F&agbaccepted=false&dataprivacyaccepted=true&feedbackpermissionaccepted=false&newsletter=false&services=206705,228987&servicestext=Testzentrum%20Freiheitshalle%20(nur%20kostenloser%20B%C3%BCrgertest%20%2F%20ANTIGEN%20Schnelltest)%3Cbr%3EKostenloser%20Covid%2019%20Antigen%20Schnelltest%20%22B%C3%BCrgertest%22%20(AUCH%20F%C3%9CR%20TOURISTEN)&servicesinclsgtext=W%C3%A4hlen%20Sie%20den%20gew%C3%BCnschten%20Standort%3Cbr%3ETestzentrum%20Freiheitshalle%20(nur%20kostenloser%20B%C3%BCrgertest%20%2F%20ANTIGEN%20Schnelltest)%3Cbr%3EGew%C3%BCnschte%20Leistungen%3Cbr%3EKostenloser%20Covid%2019%20Antigen%20Schnelltest%20%22B%C3%BCrgertest%22%20(AUCH%20F%C3%9CR%20TOURISTEN)&Additional4=1&Salutation=Herr&Additional3=Deutschland&Additional10=&calendarname=Schnelltestzentrum%20Freiheitshalle%202&location=null&tzaccount=W. Europe Standard Time&checkexist=1&pricegross=0&capacity=1&servicescapacity=&servicescapacitydetails=Testzentrum%20Freiheitshalle%20(nur%20kostenloser%20B%C3%BCrgertest%20%2F%20ANTIGEN%20Schnelltest)%090%0D%0AKostenloser%20Covid%2019%20Antigen%20Schnelltest%20%22B%C3%BCrgertest%22%20(AUCH%20F%C3%9CR%20TOURISTEN)%090%0D%0A&canceldeadline=24&sync=1&sendemail=1&appointmentreminderhours=-24&appointmentreminderhours2=-2&sendinvoice=1&nrappbooked=1&capused=true&capmaxused=2&customerconfirm=false&calselid=-1&lnm=1&emailm=1&storeip=true&apw=false"
  );
  searchParams.set(
    "bookerinfo",
    `Vorname\t${info.firstName}\r\n` +
      `Name\t${info.lastName}\r\n` +
      `Strasse mit Hausnummer\t${info.address}\r\n` +
      `PLZ\t${info.plz}\r\n` +
      `Ort\t${info.place}\r\n` +
      `Mobilnummer\t${phoneNumber}\r\n` +
      `E-Mail\t${info.email}\r\n` +
      `Geburtsdatum (❗Format TT.MM.JJJ)\t${info.birthday}\r\n` +
      `\t\r\n` +
      `Land\tDeutschland\r\n` +
      `Mir ist bekannt, dass bei einem positiven Testergebnis meine persönlichen Daten, im Rahmen von Meldepflichten gemäß Art. 9 des Infektionsschutzgesetzes (IfSG), an das zuständige Gesundheitsamt übermittelt werden. Zudem müssen Sie sich umgehend in häusliche Isolation begeben und sofort Kontakt zum zuständigen Gesundheitsamt aufzunehmen. Mit dem Gesundheitsamt vereinbaren Sie einen Termin für einen zweiten Test auf SARS-CoV-2 (PCR-Test), um die Infektion zu bestätigen.\tchecked\r\n` +
      `Terminerinnerung\t24 Stunden vor Termin\r\n`
  );

  searchParams.set("FirstName", info.firstName);
  searchParams.set("LastName", info.lastName);
  searchParams.set("Street", info.address);
  searchParams.set("ZIP", info.plz);
  searchParams.set("City", info.place);
  searchParams.set("Birthday", info.birthday);
  searchParams.set("Phone", phoneNumber);
  searchParams.set("Email", info.email);
  searchParams.set("EmailCheck", info.email);
  searchParams.set("Salutation", info.salutation);

  searchParams.set("calendarname", slot.calendarName);
  searchParams.set("calname", slot.calendarName);
  searchParams.set("calendarid", slot.calendarId.toString());
  searchParams.set("start", "{{start}}");
  searchParams.set("end", "{{end}}");
  searchParams.set("services", "{{services}}");

  const templateString = searchParams.toString();
  const finalPayload = templateString
    .replace(escape("{{services}}"), "206705,228987")
    .replace(escape("{{start}}"), slot.startTime)
    .replace(escape("{{end}}"), slot.endTime);
  try {
    await axios.post(url, finalPayload, {
      headers: {
        // @ts-ignore
        webid: "testnow_schnelltestzentrum",
        "content-type": "text/plain",
      },
    });
    console.log(chalk.bold.green("Booking success!"));
  } catch (e) {
    console.log(
      chalk.red(
        `Failed to book appointment. Reason: ${
          (e as Error).message
        }\n Response: \n ${JSON.stringify(
          (e as { response: any }).response?.data
        )}`
      )
    );
    console.log(chalk.grey(finalPayload));
    process.exit(1);
  }
};
