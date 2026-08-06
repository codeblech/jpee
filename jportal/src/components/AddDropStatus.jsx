import { CalendarDays, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";

const datePattern = /\d{1,2}-[A-Za-z]{3}-\d{4}\s+\d{1,2}:\d{2}\s+[AP]M/;

function parseStage(raw, index) {
  const [text, status = ""] = raw.split("@");
  const date = text.match(datePattern)?.[0] || null;
  const coordinator = text.match(/\bby\s+(.+?)(?:\s*\(|$)/i)?.[1]?.trim() || null;
  const title = text.replace(datePattern, "").replace(/\bby\s+.+?(?:\s*\([^)]*\))?$/i, "").replace(/(?:Date:-|Submitted on)\s*$/i, "").replace(/^\d+\.\s*/, "").trim();
  return { index, status, date, coordinator, title: title || text.trim() };
}

export default function AddDropStatus({ addDropStatus }) {
  const requests = addDropStatus?.totalsubjectDetailList || [];
  const rejectedSubjects = addDropStatus?.subjectListrejected || [];

  if (requests.length === 0 && rejectedSubjects.length === 0) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">No add/drop requests found for this semester</div>;
  }

  return (
    <div className="mt-4 space-y-4 pb-4">
      {requests.map((request, requestIndex) => {
        const stages = (request.totalStages || []).filter(Boolean).map(parseStage);
        const title = request.subjectdesc || request.subjectname || request.choicetype || "Add/Drop request";
        const code = request.subjectcode || request.subjectid;
        return (
          <Card key={request.subjectid || `${title}-${requestIndex}`} className="overflow-hidden shadow-lg">
            <div className="border-b border-border bg-muted/40 px-4 py-3">
              <h3 className="text-sm font-semibold leading-tight text-card-foreground">{title}</h3>
              {code && <p className="mt-1 font-mono text-xs text-muted-foreground">{code}</p>}
              {request.choicetype && request.choicetype !== title && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{request.choicetype}</p>}
            </div>
            <div className="space-y-4 p-4">
              {stages.map((stage, index) => (
                <div key={`${requestIndex}-${stage.index}`} className="relative flex gap-3">
                  {index < stages.length - 1 && <div className="absolute left-3 top-7 h-[calc(100%-0.25rem)] w-px bg-border" />}
                  <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stage.status === "D" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index + 1}</div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="text-sm font-medium text-card-foreground">{stage.title}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      {stage.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{stage.date}</span>}
                      {stage.coordinator && <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{stage.coordinator}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
      {rejectedSubjects.length > 0 && (
        <Card className="shadow-lg">
          <div className="border-b border-border bg-muted/40 px-4 py-3"><h3 className="text-sm font-semibold text-card-foreground">Previous Rejected Subjects</h3></div>
          <div className="divide-y divide-border">
            {rejectedSubjects.map((subject, index) => (
              <div key={`${subject.subjectcode}-${index}`} className="space-y-1 px-4 py-3 text-sm">
                <p className="font-medium text-card-foreground">{subject.subjectdesc || subject.subjectcode}</p>
                <p className="font-mono text-xs text-muted-foreground">{subject.subjectcode}</p>
                {subject.referencesubjname && <p className="text-xs text-muted-foreground">Reference: {subject.referencesubjname} {subject.referencesubjcode && `(${subject.referencesubjcode})`}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
