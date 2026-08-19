import classNames from "classnames";
import React, { FC } from "react";
import { DetailDto } from "@/dtos/keyword/Detail.dto";

// `videos` 배열의 요소 타입만 추출
type VideoProps = DetailDto["videos"][number];

const Video: FC<VideoProps> = (props) => {
  const {
    link,
    title,
    imageUrl,
    channel,
    channelProfileUrl,
    view,
    publishedAt,
    chennelLink // 오타가 있다면 DetailDto에서 수정 필요
  } = props;

  const getViewString = (view: number): string => {
    if (view < 1000) {
      // 1000 이하 그대로 출력
      return `${view}`;
    } else if (view < 10000) {
      // 1000 이상 10000 미만: 천 단위로 변환
      return `${(view / 1000).toFixed(1)}천회`;
    } else if (view < 100000) {
      // 10000 이상 100000 미만: 만 단위로 변환
      return `${(view / 10000).toFixed(1)}만회`;
    } else {
      // 100000 이상: 만 단위로 반올림
      return `${Math.floor(view / 10000)}만회`;
    }
  };

  return (
    <div className={classNames("w-full h-[120px] flex flex-row gap-[10px]")}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className="w-[210px] h-[120px] flex flex-col items-center">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full rounded-[8px] object-fit"
          />
        </div>
      </a>

      <div className="flex flex-col justify-between">
        <div className="flex flex-col">
          <h3 className="text-[16px] font-medium line-clamp-1">{title}</h3>
          <span className="text-[14px] tracking-tighter text-[#9C9C9C] line-clamp-1">
            조회수 {getViewString(Number(view))} · {publishedAt}
          </span>
        </div>

        <a
          href={chennelLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row gap-[6px] items-center"
        >
          <img
            src={channelProfileUrl}
            alt={channel}
            className="w-[26px] aspect-square rounded-full"
          />
          <p className="text-[14px] tracking-tighter text-[#A5A5A5] line-clamp-1">
            {channel}
          </p>
        </a>
      </div>
    </div>
  );
};

export default Video;
