import { CalendarDays, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";

const datePattern = /\d{1,2}-[A-Za-z]{3}-\d{4}\s+\d{1,2}:\d{2}\s+[AP]M/;

function parseStage(raw, index) {
  const [text, status = ""] = raw.split("@");
  const date = text.match(datePattern)?.[0] || null;
  const coordinator = text.match(/\bby\s+(.+?)(?:\s*\(|$)/i)?.[1]?.trim() || null;
  const title = text
    .replace(datePattern, "")
    .replace(/\bby\s+.+?(?:\s*\([^)]*\))?$/i, "")
    .replace(/(?:Date:-|Submitted on)\s*$/i, "")
    .replace(/^\d+\.\s*/, "")
    .trim();

  return {
    index,
    text: text.trim(),
    status,
    date,
    coordinator,
    title: title || text.trim(),
  };
}

export default function MoocStatus({ moocStatus }) {
  const subjects = moocStatus?.totalsubjectDetailList || [];

  if (subjects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No MOOC status found for this semester
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4 pb-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {moocStatus.duesAmount > 0 && (
          <span className="rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 font-medium text-destructive">
            Pending dues: {moocStatus.duesAmount}
          </span>
        )}
        {moocStatus.onlyapprovedbyvc === "Y" && (
          <span className="rounded-full border border-border bg-muted px-3 py-1 font-medium">
            Final approval only
          </span>
        )}
      </div>

      {subjects.map((subject) => {
        const stages = subject.totalStages
          .filter(Boolean)
          .map((stage, index) => parseStage(stage, index));

        return (
          <Card key={subject.subjectid} className="overflow-hidden shadow-lg">
            <div className="border-b border-border bg-muted/40 px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold leading-tight text-card-foreground">
                    {subject.subjectdesc}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{subject.subjectcode}</p>
                </div>
                <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  {stages.length} stage{stages.length === 1 ? "" : "s"}
                </span>
              </div>
              {subject.choicetype && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{subject.choicetype}</p>
              )}
            </div>

            <div className="space-y-4 p-4">
              {stages.map((stage, index) => (
                <div key={`${subject.subjectid}-${stage.index}`} className="relative flex gap-3">
                  {index < stages.length - 1 && (
                    <div className="absolute left-3 top-7 h-[calc(100%-0.25rem)] w-px bg-border" />
                  )}
                  <div
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      stage.status === "D"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="text-sm font-medium text-card-foreground">{stage.title}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      {stage.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {stage.date}
                        </span>
                      )}
                      {stage.coordinator && (
                        <span className="inline-flex items-center gap-1.5">
                          <UserRound className="h-3.5 w-3.5" />
                          {stage.coordinator}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
