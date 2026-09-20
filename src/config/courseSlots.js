// 免费线上课程时段（语言中立文本，入库即此值）。每期换届只改这里。
export const COURSE_TIME_SLOTS = [
  'Sep 30 10:00pm–11:00pm',
  'Oct 11 10:00am–11:00am',
  'Oct 18 10:00am–11:00am',
];

// 报名表单里的「免费课程时段」选择：保留到最后一节课(10/18)上完为止。
// 过了台湾时间(UTC+8) 10/19 00:00 后，对消费者隐藏此字段；后台(/partners)不受影响，仍能看到已选值。
// 带明确时区偏移，比较的是绝对时刻，与访客浏览器所在时区无关。
export const COURSE_SELECTION_HIDE_AFTER = '2026-10-19T00:00:00+08:00';

export const isCourseSelectionOpen = (now = new Date()) => {
  const cutoff = new Date(COURSE_SELECTION_HIDE_AFTER);
  if (Number.isNaN(cutoff.getTime())) return true; // 解析异常时保守显示
  return now.getTime() < cutoff.getTime();
};
