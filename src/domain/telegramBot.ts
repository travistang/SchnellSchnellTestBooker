import QRCode, { QRCodeToBufferOptions } from "qrcode";
import chalk from "chalk";
import { format } from "date-fns";
import { Telegraf } from "telegraf";

export const sendBookingIdAsQRCode = async (
  bookingId: string,
  forDate: Date
) => {
  const token = process.env.TG_BOT_TOKEN;
  const userId = process.env.TG_USER_ID;
  if (!token || !userId) {
    console.log(
      chalk.red(
        "Missing TG_BOT_TOKEN. No messages can be sent to you through telegram."
      )
    );
    return;
  }

  const bot = new Telegraf(token);

  const qrCodeString = `TerminID_${bookingId}`;
  // @ts-ignore
  const qrCodeBuffer = await QRCode.toBuffer(qrCodeString, {
    version: 4,
    errorCorrectionLevel: "Q",
    maskPattern: 2,
  } as QRCodeToBufferOptions);

  bot.telegram.sendPhoto(
    userId,
    {
      source: qrCodeBuffer,
    },
    { caption: `Booking for ${format(forDate, "PPPPp")}` }
  );
};
