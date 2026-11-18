"use client";

import React, { useState } from "react";
import { Reorder } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ClipboardPaste,
  GripVertical,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { parseGeminiMilestonesWithReport } from "@/lib/parser";
import { countWords, formatOffsetLabel, validateActionText } from "@/lib/planner";
import { useCountdownStore } from "@/store/useCountdownStore";
import {
  CURATED_EMOJIS,
  CURATED_LUCIDE_ICONS,
  MilestoneIcon,
} from "@/components/lockscreen/MilestoneIcon";
import { Button, Input, StudioCard, Textarea } from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/ToastProvider";

const SAMPLE_GEMINI_PASTE = `T-14 Days (Nov 3): Order the fresh turkey
T-10 Days (Nov 7): Finalize guest list
T-7 Days (Nov 10): Delegate side dishes
T-5 Days (Nov 12): Shop dry groceries
T-2 Days (Nov 15): Prep pie crusts
T-1 Day (Nov 16): Set the table
T-0 Days (Nov 17): Roast and celebrate`;

export function StepMilestones() {
  const {
    deadline,
    milestones,
    setMilestones,
    updateMilestone,
    toggleMilestone,
    addMilestone,
    removeMilestone,
    reorderMilestones,
    regenerateMilestones,
    setActiveStep,
  } = useCountdownStore();
  const { toast } = useToast();

  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [openIconRowId, setOpenIconRowId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleImportPaste = () => {
    const result = parseGeminiMilestonesWithReport(
      pasteText,
      deadline.targetDateISO,
      deadline.timezone
    );
    if (result.milestones.length === 0) {
      toast({
        title: "No T-minus lines found",
        description:
          'Use lines like "T-7 Days (Nov 10): Delegate side dishes".',
        variant: "error",
      });
      return;
    }

    setMilestones(result.milestones);
    setShowPasteBox(false);
    setPasteText("");
    toast({
      title: `Imported ${result.milestones.length} milestones`,
      description:
        result.truncatedCount > 0
          ? `${result.truncatedCount} phrase(s) trimmed to the 5-word lock-screen limit.`
          : "Dates and icons matched automatically.",
      variant: "success",
    });
  };

  const handleAiReplan = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: deadline.title,
          targetDateISO: deadline.targetDateISO,
          timezone: deadline.timezone,
          category: deadline.category,
          questionnaire: deadline.questionnaire,
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.milestones)) {
        setMilestones(data.milestones);
        toast({
          title:
            data.source === "gemini"
              ? "Re-planned with Gemini"
              : "Re-planned backward ladder",
          variant: "success",
        });
      }
    } catch {
      regenerateMilestones();
      toast({
        title: "Applied deterministic ladder",
        variant: "info",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const moveRow = (index: number, delta: -1 | 1) => {
    const targetIdx = index + delta;
    if (targetIdx < 0 || targetIdx >= milestones.length) return;
    const copy = [...milestones];
    const [item] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, item);
    reorderMilestones(copy);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <StudioCard className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAiReplan}
            disabled={aiLoading}
          >
            <Wand2 className="h-3.5 w-3.5 text-amber-400" />
            {aiLoading ? "Planning..." : "AI Re-plan"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowPasteBox((v) => !v)}
          >
            <ClipboardPaste className="h-3.5 w-3.5 text-cyan-400" />
            Paste from Gemini
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              regenerateMilestones();
              toast({ title: "Reset to offset ladder", variant: "info" });
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={addMilestone}
          disabled={milestones.length >= 7}
        >
          <Plus className="h-3.5 w-3.5" />
          Add ({milestones.length}/7)
        </Button>
      </StudioCard>

      {/* Paste from Gemini Importer Drawer */}
      {showPasteBox && (
        <StudioCard className="space-y-3 border-cyan-500/30 bg-cyan-950/15">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-cyan-200">
              Paste from Gemini (one milestone per line)
            </p>
            <button
              type="button"
              onClick={() => setPasteText(SAMPLE_GEMINI_PASTE)}
              className="text-[11px] font-medium text-cyan-300 hover:underline"
            >
              Insert sample
            </button>
          </div>
          <Textarea
            rows={5}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`T-7 Days (Nov 10): Delegate side dishes\nT-3 Days (Nov 14): Prep desserts\nT-0 Days (Nov 17): Host celebration`}
            className="font-mono text-xs"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPasteBox(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="amber"
              size="sm"
              onClick={handleImportPaste}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Parse & Replace Milestones
            </Button>
          </div>
        </StudioCard>
      )}

      {/* Draggable Milestone Rows */}
      <Reorder.Group
        axis="y"
        values={milestones}
        onReorder={reorderMilestones}
        className="space-y-2.5"
      >
        {milestones.map((m, idx) => {
          const validation = validateActionText(m.action);
          const words = countWords(m.action);
          const iconOpen = openIconRowId === m.id;

          return (
            <Reorder.Item
              key={m.id}
              value={m}
              className="rounded-2xl border border-white/[0.08] bg-studio-surface/95 p-3 shadow-md"
            >
              <div className="flex items-start gap-2.5">
                {/* Drag Handle + Keyboard Up/Down */}
                <div className="flex flex-col items-center gap-0.5 pt-1 text-zinc-500">
                  <button
                    type="button"
                    aria-label="Move milestone up"
                    onClick={() => moveRow(idx, -1)}
                    disabled={idx === 0}
                    className="rounded p-0.5 hover:bg-white/10 hover:text-zinc-200 disabled:opacity-25"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
                  <button
                    type="button"
                    aria-label="Move milestone down"
                    onClick={() => moveRow(idx, 1)}
                    disabled={idx === milestones.length - 1}
                    className="rounded p-0.5 hover:bg-white/10 hover:text-zinc-200 disabled:opacity-25"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                {/* Checked Toggle */}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={m.checked}
                  aria-label={`Mark ${m.action} complete`}
                  onClick={() => toggleMilestone(m.id)}
                  className={`mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    m.checked
                      ? "border-amber-400 bg-amber-400 text-zinc-950"
                      : "border-white/25 bg-black/40 hover:border-amber-400/60"
                  }`}
                >
                  {m.checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>

                {/* Main Controls */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Offset Input */}
                    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2 py-1">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        T-
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={365}
                        aria-label="T-minus days offset"
                        value={m.offsetDays}
                        onChange={(e) => {
                          const val = Math.max(
                            0,
                            Math.min(365, Number.parseInt(e.target.value, 10) || 0)
                          );
                          updateMilestone(m.id, { offsetDays: val });
                        }}
                        className="w-10 bg-transparent font-mono text-xs font-semibold text-zinc-100 focus:outline-none"
                      />
                      <span className="text-[11px] text-zinc-400">
                        {formatOffsetLabel(m.offsetDays).includes("Day ")
                          ? "Day"
                          : "Days"}
                      </span>
                    </div>

                    <span className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[11px] text-zinc-300">
                      {m.formattedDate}
                    </span>

                    {/* Live Word Counter */}
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        validation.valid
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {words}/5 words
                    </span>
                  </div>

                  {/* Action Input + Icon Picker + Delete */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={m.action}
                      aria-label="Milestone action (max 5 words)"
                      onChange={(e) =>
                        updateMilestone(m.id, { action: e.target.value })
                      }
                      placeholder="Short action (max 5 words)"
                      className={`h-9 text-xs ${
                        !validation.valid ? "border-rose-500/70" : ""
                      }`}
                    />

                    {/* Icon Picker Trigger */}
                    <button
                      type="button"
                      aria-label="Pick milestone icon"
                      onClick={() =>
                        setOpenIconRowId(iconOpen ? null : m.id)
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-zinc-100 transition hover:border-amber-400/50"
                    >
                      <MilestoneIcon icon={m.icon} size={16} />
                    </button>

                    <button
                      type="button"
                      aria-label="Remove milestone"
                      onClick={() => removeMilestone(m.id)}
                      disabled={milestones.length <= 2}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-300 disabled:opacity-25"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {!validation.valid && (
                    <p className="text-[11px] font-medium text-rose-400">
                      {validation.error} — concise phrases keep lock screens scannable.
                    </p>
                  )}

                  {/* Inline Icon Picker Grid */}
                  {iconOpen && (
                    <div className="rounded-xl border border-white/10 bg-black/75 p-2.5">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        Icons
                      </p>
                      <div className="grid grid-cols-8 gap-1">
                        {CURATED_LUCIDE_ICONS.map((iconName) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                              updateMilestone(m.id, { icon: iconName });
                              setOpenIconRowId(null);
                            }}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                              m.icon === iconName
                                ? "border-amber-400 bg-amber-400/20 text-amber-200"
                                : "border-white/5 bg-white/[0.03] text-zinc-300 hover:bg-white/10"
                            }`}
                          >
                            <MilestoneIcon icon={iconName} size={14} />
                          </button>
                        ))}
                      </div>
                      <p className="mb-1.5 mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        Emojis
                      </p>
                      <div className="grid grid-cols-8 gap-1">
                        {CURATED_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              updateMilestone(m.id, { icon: emoji });
                              setOpenIconRowId(null);
                            }}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition ${
                              m.icon === emoji
                                ? "border-amber-400 bg-amber-400/20"
                                : "border-white/5 bg-white/[0.03] hover:bg-white/10"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          variant="amber"
          onClick={() => setActiveStep("style")}
        >
          Style Lock Screen →
        </Button>
      </div>
    </div>
  );
}
