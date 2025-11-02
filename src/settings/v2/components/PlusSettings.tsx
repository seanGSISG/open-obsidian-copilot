import { Badge } from "@/components/ui/badge";
import { useIsPlusUser } from "@/plusUtils";
import React from "react";

export function PlusSettings() {
  const isPlusUser = useIsPlusUser();

  return (
    <section className="tw-flex tw-flex-col tw-gap-4 tw-rounded-lg tw-bg-secondary tw-p-4">
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-text-xl tw-font-bold">
        <span>Copilot Plus</span>
        {isPlusUser && (
          <Badge variant="outline" className="tw-text-success">
            Active
          </Badge>
        )}
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2 tw-rounded-md tw-bg-callout-warning/10 tw-border tw-border-callout-warning/30 tw-p-3">
        <div className="tw-text-sm tw-font-semibold tw-text-callout-warning">
          Community Fork Notice
        </div>
        <div className="tw-text-sm tw-text-muted">
          This is a community fork of Obsidian Copilot. All Plus features are enabled by default
          without requiring a license key. Advanced features like web search, YouTube transcripts,
          and PDF processing will be available after configuring MCP servers in a future update.
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2 tw-text-sm tw-text-muted">
        <div>
          Copilot Plus takes your Obsidian experience to the next level with cutting-edge AI
          capabilities. This premium tier unlocks advanced features:{" "}
          <strong>
            {" "}
            including chat context, PDF and image support, web search integration, exclusive chat
            and embedding models, and much more.
          </strong>
        </div>
        <div>
          Copilot Plus is evolving fast, with new features and improvements rolling out regularly.
        </div>
      </div>
    </section>
  );
}