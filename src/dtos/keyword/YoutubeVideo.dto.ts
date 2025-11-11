export interface YoutubeVideoDto {
  link: string; // 비디오 링크
  title: string; // 비디오 제목
  imageUrl: string; // 비디오 썸네일 URL
  channel: string; // 채널 이름
  chennelLink: string; // 채널 링크
  channelProfileUrl: string; // 채널 프로필 이미지 URL
  view: string; // 조회수 (문자열로 처리)
  publishedAt: string;
}
