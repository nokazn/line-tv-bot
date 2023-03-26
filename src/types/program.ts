import { ValueOf } from './utils';

type NewsGenres = {
  '00': 'ニュース／報道 - 定時・総合';
  '01': 'ニュース／報道 - 天気';
  '02': 'ニュース／報道 - 特集・ドキュメント';
  '03': 'ニュース／報道 - 政治・国会';
  '04': 'ニュース／報道 - 経済・市況';
  '05': 'ニュース／報道 - 海外・国際';
  '06': 'ニュース／報道 - 解説';
  '07': 'ニュース／報道 - 討論・会談';
  '08': 'ニュース／報道 - 報道特番';
  '09': 'ニュース／報道 - ローカル・地域';
  '0a': 'ニュース／報道 - 交通';
  '0f': 'ニュース／報道 - その他';
};

type SportsGenres = {
  '10': 'スポーツ - スポーツニュース';
  '11': 'スポーツ - 野球';
  '12': 'スポーツ - サッカー';
  '13': 'スポーツ - ゴルフ';
  '14': 'スポーツ - その他の球技';
  '15': 'スポーツ - 相撲・格闘技';
  '16': 'スポーツ - オリンピック・国際大会';
  '17': 'スポーツ - マラソン・陸上・水泳';
  '18': 'スポーツ - モータースポーツ';
  '19': 'スポーツ - マリン・ウィンタースポーツ';
  '1a': 'スポーツ - 競馬・公営競技';
  '1f': 'スポーツ - その他';
};

type InformationGenres = {
  '20': '情報／ワイドショー - 芸能・ワイドショー';
  '21': '情報／ワイドショー - ファッション';
  '22': '情報／ワイドショー - 暮らし・住まい';
  '23': '情報／ワイドショー - 健康・医療';
  '24': '情報／ワイドショー - ショッピング・通販';
  '25': '情報／ワイドショー - グルメ・料理';
  '26': '情報／ワイドショー - イベント';
  '27': '情報／ワイドショー - 番組紹介・お知らせ';
  '2f': '情報／ワイドショー - その他';
};

type DramaGenres = {
  '30': 'ドラマ - 国内ドラマ';
  '31': 'ドラマ - 海外ドラマ';
  '32': 'ドラマ - 時代劇';
  '3f': 'ドラマ - その他';
};

type MusicGenres = {
  '40': '音楽 - 国内ロック・ポップス';
  '41': '音楽 - 海外ロック・ポップス';
  '42': '音楽 - クラシック・オペラ';
  '43': '音楽 - ジャズ・フュージョン';
  '44': '音楽 - 歌謡曲・演歌';
  '45': '音楽 - ライブ・コンサート';
  '46': '音楽 - ランキング・リクエスト';
  '47': '音楽 - カラオケ・のど自慢';
  '48': '音楽 - 民謡・邦楽';
  '49': '音楽 - 童謡・キッズ';
  '4a': '音楽 - 民族音楽・ワールドミュージック';
  '4f': '音楽 - その他';
};

type EntertainmentGenres = {
  '50': 'バラエティ - クイズ';
  '51': 'バラエティ - ゲーム';
  '52': 'バラエティ - トークバラエティ';
  '53': 'バラエティ - お笑い・コメディ';
  '54': 'バラエティ - 音楽バラエティ';
  '55': 'バラエティ - 旅バラエティ';
  '56': 'バラエティ - 料理バラエティ';
  '5f': 'バラエティ - その他';
};

type MovieGenres = {
  '60': '映画 - 洋画';
  '61': '映画 - 邦画';
  '62': '映画 - アニメ';
  '6f': '映画 - その他';
};

type AnimationGenres = {
  '70': 'アニメ／特撮 - 国内アニメ';
  '71': 'アニメ／特撮 - 海外アニメ';
  '72': 'アニメ／特撮 - 特撮';
  '7f': 'アニメ／特撮 - その他';
};

type DocumentaryGenres = {
  '81': 'ドキュメンタリー／教養 - 歴史・紀行';
  '82': 'ドキュメンタリー／教養 - 自然・動物・環境';
  '83': 'ドキュメンタリー／教養 - 宇宙・科学・医学';
  '84': 'ドキュメンタリー／教養 - カルチャー・伝統文化';
  '85': 'ドキュメンタリー／教養 - 文学・文芸';
  '86': 'ドキュメンタリー／教養 - スポーツ';
  '87': 'ドキュメンタリー／教養 - ドキュメンタリー全般';
  '88': 'ドキュメンタリー／教養 - インタビュー・討論';
  '8f': 'ドキュメンタリー／教養 - その他';
  '80': 'ドキュメンタリー／教養 - 社会・時事';
};

type TheaterGenres = {
  '90': '劇場／公演 - 現代劇・新劇';
  '91': '劇場／公演 - ミュージカル';
  '92': '劇場／公演 - ダンス・バレエ';
  '93': '劇場／公演 - 落語・演芸';
  '94': '劇場／公演 - 歌舞伎・古典';
  '9f': '劇場／公演 - その他';
};

type EducationGenres = {
  a0: '趣味／教育 - 旅・釣り・アウトドア';
  a1: '趣味／教育 - 園芸・ペット・手芸';
  a2: '趣味／教育 - 音楽・美術・工芸';
  a3: '趣味／教育 - 囲碁・将棋';
  a4: '趣味／教育 - 麻雀・パチンコ';
  a5: '趣味／教育 - 車・オートバイ';
  a6: '趣味／教育 - コンピュータ・TV ゲーム';
  a7: '趣味／教育 - 会話・語学';
  a8: '趣味／教育 - 幼児・小学生';
  a9: '趣味／教育 - 中学生・高校生';
  aa: '趣味／教育 - 大学生・受験';
  ab: '趣味／教育 - 生涯教育・資格';
  ac: '趣味／教育 - 教育問題';
  af: '趣味／教育 - その他';
};

type WelfareGenres = {
  b0: '福祉 - 高齢者';
  b1: '福祉 - 障害者';
  b2: '福祉 - 社会福祉';
  b3: '福祉 - ボランティア';
  b4: '福祉 - 手話';
  b5: '福祉 - 文字（字幕）';
  b6: '福祉 - 音声解説';
  bf: '福祉 - その他';
};

type OtherGenres = {
  ff: 'その他 - その他';
};

/**
 * @description 番組のカテゴリー
 */
export type ProgramGenres = {
  news: NewsGenres;
  sports: SportsGenres;
  information: InformationGenres;
  drama: DramaGenres;
  music: MusicGenres;
  entertainment: EntertainmentGenres;
  movie: MovieGenres;
  animation: AnimationGenres;
  documentary: DocumentaryGenres;
  theater: TheaterGenres;
  education: EducationGenres;
  welfare: WelfareGenres;
  other: OtherGenres;
};

export type ChannelTypes = {
  地上波: 2;
  BSデジタル: 3;
  BS4K: 5;
  CS: 120;
};

export type ChannelTypeValues = ValueOf<ChannelTypes>;
