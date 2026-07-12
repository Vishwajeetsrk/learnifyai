export function generateICS(
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  location: string = "Learnify AI Online",
) {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Learnify AI//Calendar Sync//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@learnify.ai`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\\r\\n");

  return icsContent;
}

export function downloadICS(
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  location: string = "Learnify AI Online",
) {
  const icsContent = generateICS(title, description, startDate, endDate, location);

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 100);
}
