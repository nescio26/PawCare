import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

export const formatDate = (date) => {
  return dayjs(date).format("DD MM YYYY");
};

export const formatDateTime = (date) => {
  return dayjs(date).format("DD MM YYYY, hh:mm A");
};

export const formatRelative = (date) => {
  return dayjs(date).fromNow();
};

export const formatTime = (date) => {
  return dayjs(date).format("hh:mm A");
};
