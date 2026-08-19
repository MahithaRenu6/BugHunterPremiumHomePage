import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/PageFrame";
import { DetectionRun } from "@/components/DetectionRun";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "AI bug detection — BugHunter scan engine" },
      {
        name: "description",
        content:
          "Run a live scan on sample code and watch BugHunter surface the bug type, severity, exact line and confidence score.",
      },
      { property: "og:title", content: "AI bug detection — BugHunter scan engine" },
      {
        property: "og:description",
        content: "Live scanning animation with bug type, severity, line and confidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scanning,
});

function Scanning() {
  return (
    <PageFrame index={2} kicker="Detection">
      <div className="flex-1 pt-8">
        <h1 className="display-xl max-w-[12ch]">
          Something
          <br />
          is wrong.
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          BugHunter scans billions of patterns to detect issues that are easy to miss and hard to
          debug — before they reach production.
        </p>

        <div className="mt-14">
          <DetectionRun />
        </div>
      </div>
    </PageFrame>
  );
}
