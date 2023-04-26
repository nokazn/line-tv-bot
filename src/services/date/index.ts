import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ja';

dayjs.locale('ja');
dayjs.extend(customParseFormat);

export { dayjs };
