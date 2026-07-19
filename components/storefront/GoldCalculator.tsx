"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { formatAZN } from "@/lib/format";

const PURITIES = [375, 417, 500, 583, 585, 750, 875, 916, 995];

export function GoldCalculator({ goldPricePerGramAZN }: { goldPricePerGramAZN: string }) {
  const t = useTranslations("calculator");
  const [purity, setPurity] = useState(750);
  const [weight, setWeight] = useState("1");

  const rawGoldValue = useMemo(() => {
    const weightNumber = Number(weight);
    if (!Number.isFinite(weightNumber) || weightNumber < 0) return null;
    // Raw gold value only — no labor/margin, see CLAUDE.md "Gold calculator logic".
    return weightNumber * (purity / 1000) * Number(goldPricePerGramAZN);
  }, [purity, weight, goldPricePerGramAZN]);

  return (
    <div className="max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-label-md text-on-surface-variant">{t("purityLabel")}</span>
          <select
            value={purity}
            onChange={(event) => setPurity(Number(event.target.value))}
            className="mt-1 w-full border border-outline-variant rounded-sm px-3 py-2 bg-surface-container-lowest text-on-surface"
          >
            {PURITIES.map((p) => (
              <option key={p} value={p}>
                {p} əyar
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-label-md text-on-surface-variant">{t("weightLabel")}</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="mt-1 w-full border border-outline-variant rounded-sm px-3 py-2 bg-surface-container-lowest text-on-surface"
          />
        </label>
      </div>

      <div className="mt-8 border-t border-outline-variant pt-6">
        <p className="text-label-sm text-on-surface-variant tracking-wide uppercase">{t("resultLabel")}</p>
        <p className="font-(family-name:--font-display-lg-mobile) text-display-lg-mobile text-secondary mt-1">
          {rawGoldValue != null ? formatAZN(rawGoldValue) : "—"}
        </p>
      </div>

      <p className="mt-4 text-label-sm text-on-surface-variant">{t("disclaimer")}</p>
    </div>
  );
}
