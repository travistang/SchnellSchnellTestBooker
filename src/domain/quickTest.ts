import chalk from "chalk";
import format from "date-fns/format";
import axios from 'axios';

export type Options = {
  startTime: string;
  endTime: string;
  freeSlots: number;
  calendarId: number;
  calendarName: string;
}

export type RawOption = {
  start: string,
  end: string,
  calendarid: number,
  calendarname: string,
  cap: number,
}

export const getAvailableTimeSlotsOnDay = async (date: number): Promise<Options[]> => {
  const searchParams = new URLSearchParams(
    "serviceid=206705,228987&capacity=1&caching=false&duration=0&cluster=false&slottype=0&fillcalendarstrategy=0&showavcap=true&appfuture=10&appdeadline=1&msdcm=0&appdeadlinewm=0&tz=W.%20Europe%20Standard%20Time&tzaccount=W.%20Europe%20Standard%20Time&calendarid="
  );
  searchParams.set('date', format(date, 'yyyy-MM-dd'));
  const url = `https://www.etermin.net/api/timeslots?${searchParams.toString()}`;
  try {
    const response = await axios({
      method: "get",
      url,
      headers: {
        // @ts-ignore
        webid: "testnow_schnelltestzentrum",
        accept: "application/json, text/plain"
      },
    });
    const payloads = response.data as RawOption[];
    return payloads.map(payload => ({
      startTime: format(new Date(payload.start), 'yyyy-MM-dd HH:mm'),
      endTime: format(new Date(payload.end), 'yyyy-MM-dd HH:mm'),
      freeSlots: payload.cap,
      calendarId: payload.calendarid,
      calendarName: payload.calendarname
    })).filter(option => option.freeSlots > 0);
  } catch(e) {
    console.log(chalk.red(`Error: Failed to fetch available timeslots for date. Reason: ${(e as Error).message}`));
    process.exit(1);
  }
}