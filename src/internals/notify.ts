import type { ResultAsync } from 'neverthrow';
import type * as line from '@line/bot-sdk';

import { dayjs } from '~/services';
import { generateUrl, distributeList, abbreviateText } from '~/utils';
import type { Line } from '~/services';
import type { Program } from '~/entities';

const GOOGLE_CALENDAR_BASE_URL = 'https://calendar.google.com/calendar/event';
const NEW_LINE = '\n';

/**
 * ----------------------------------------------------------------------------------------------------
 * @description
 * - 時間の間隔を表す文字列を返す
 * - 日付をまたぐ場合、0-4時台の終了時刻は24-28時と表記する
 * @package
 */
export const toTimeRange = (start: Date, end: Date) => {
  const from = dayjs(start);
  const to = dayjs(end);
  const fromText = from.format(`YYYY年M月D日 H:mm`);
  const toHour = to.hour();
  const toText =
    from.hour() > toHour && toHour < 5 ? `${toHour + 24}:${to.format('mm')}` : to.format('H:mm');
  return `${fromText}-${toText}`;
};

/**
 * @description 番組の詳細情報を含む文字列を返す
 * @package
 */
export const generateProgramText = (
  program: Pick<Program, 'from' | 'to' | 'channel' | 'summary'>,
): string => {
  const texts = [toTimeRange(program.from, program.to), program.channel, program.summary].filter(
    Boolean,
  );
  return texts.join(NEW_LINE);
};

/**
 * @description {@link date} を `YYYYMMDDTHHmm00` の形式の文字列に変換する
 * @package
 */
const toGoogleCalendarDatesFormat = (date: Date) => dayjs(date).format('YYYYMMDDTHHmm00');

/**
 * @description Google カレンダーに追加するための URL に変換する
 * @package
 */
export const generateGoogleCalendarUrl = <T extends Pick<Program, 'from' | 'to' | 'name'>>(
  program: T,
): string => {
  const from = toGoogleCalendarDatesFormat(program.from);
  const to = toGoogleCalendarDatesFormat(program.to);
  const dates = `${from}/${to}`;
  return generateUrl(GOOGLE_CALENDAR_BASE_URL)({
    action: 'TEMPLATE',
    text: program.name,
    dates,
  }).href;
};

/**
 * @description 1つのグループのメッセージのオブジェクトを返す
 * @package
 */
const generateCarouselMessages =
  (altText: string) =>
  (group: Program[]): line.TemplateMessage => {
    const template: line.TemplateCarousel = {
      type: 'carousel',
      columns: group.map(
        (program): line.TemplateColumn => ({
          title: abbreviateText(program.name, 40),
          text: abbreviateText(generateProgramText(program), 60),
          actions: [
            {
              type: 'uri',
              label: 'Googleカレンダーに追加',
              uri: generateGoogleCalendarUrl(program),
            },
            {
              type: 'uri',
              label: '詳細',
              uri: program.url.href,
            },
          ],
        }),
      ),
      imageAspectRatio: 'rectangle',
      imageSize: 'cover',
    };
    return {
      type: 'template',
      altText,
      template,
    };
  };

/**
 * @description LINE に全メッセージを送信する
 */
export const pushMessages =
  (client: Line) =>
  (programs: Program[][]): ResultAsync<line.MessageAPIResponseBase, Error> => {
    const messages: line.Message[] = programs.flatMap((results) => {
      const countText = `該当する番組が ${results.length} 件見つかりました。`;
      const textMassage: line.TextMessage = {
        type: 'text',
        text: countText,
      };
      const carouselMessages: line.TemplateMessage[] = distributeList(10)(results).map(
        generateCarouselMessages(countText),
      );
      return [textMassage, ...carouselMessages];
    });
    return client.push(messages);
  };
