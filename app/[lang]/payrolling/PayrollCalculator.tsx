'use client';

import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FadeInUp, 
  SimpleFadeIn,
  SimpleStaggerContainer,
  SimpleStaggerItem
} from '../components/shared/animations/AnimationUtils';
import type { Locale } from '../dictionaries';

/**
 * PayrollCalculator met land-toggle (NL / UK)
 * - Past presets toe voor werkgeverslasten, vakantiegeld, reserveringen, payroll fee, valuta/locale
 * - Je kunt achteraf alle velden handmatig aanpassen
 */

type Country = "NL" | "UK";

interface PayrollCalculatorProps {
  dictionary?: any;
  lang?: Locale;
}

export default function PayrollCalculator({ dictionary, lang = 'en' }: PayrollCalculatorProps) {
  const calcTranslations = dictionary?.pages?.payrollingPage?.calculator || {};
  const countries = calcTranslations.countries || {};
  
  const PRESETS: Record<
    Country,
    {
      label: string;
      locale: string;
      currency: "EUR" | "GBP";
      employers: number;
      vacation: number;
      reserves: number;
      fee: number;
    }
  > = {
    NL: {
      label: countries.NL || "Nederland",
      locale: "nl-NL",
      currency: "EUR",
      employers: 0.21,
      vacation: 0.08,
      reserves: 0.12,
      fee: 0.05,
    },
    UK: {
      label: countries.UK || "Verenigd Koninkrijk",
      locale: "en-GB",
      currency: "GBP",
      employers: 0.17,
      vacation: 0.1207,
      reserves: 0.06,
      fee: 0.05,
    },
  };
  // Land + presets
  const [country, setCountry] = useState<Country>("NL");
  const [locale, setLocale] = useState(PRESETS.NL.locale);
  const [currency, setCurrency] = useState<"EUR" | "GBP">(PRESETS.NL.currency);

  // Inputs
  const [grossHourly, setGrossHourly] = useState(14.5);
  const [erPct, setErPct] = useState(PRESETS.NL.employers);
  const [vacPct, setVacPct] = useState(PRESETS.NL.vacation);
  const [resPct, setResPct] = useState(PRESETS.NL.reserves);
  // Payroll fee is fixed based on country preset
  const payrollFeePct = PRESETS[country].fee;
  const [hoursPerWeek, setHoursPerWeek] = useState(36);
  const [weeksPerYear, setWeeksPerYear] = useState(48);

  // Preset toepassen (zonder loon/uren te overschrijven)
  const applyPreset = (c: Country) => {
    const p = PRESETS[c];
    setCountry(c);
    setLocale(p.locale);
    setCurrency(p.currency);
    setErPct(p.employers);
    setVacPct(p.vacation);
    setResPct(p.reserves);
    // Payroll fee is automatically set based on country
  };

  // Helpers
  const clamp = (n: number, min = 0, max = 999999) => (isFinite(n) ? Math.min(Math.max(n, min), max) : 0);
  const money = (n: number) =>
    n.toLocaleString(locale, { style: "currency", currency, maximumFractionDigits: 2 });

  // Kernberekeningen
  const calc = useMemo(() => {
    const g = clamp(grossHourly);
    const er = clamp(erPct, 0, 2);
    const vac = clamp(vacPct, 0, 2);
    const res = clamp(resPct, 0, 2);
    const fee = clamp(payrollFeePct, 0, 2);

    const base = g;
    const employersCosts = g * er;
    const vacationAllowance = g * vac;
    const reserves = g * res;

    const costPerHour = base + employersCosts + vacationAllowance + reserves;
    const feeAmount = costPerHour * fee;
    const allInPerHour = costPerHour + feeAmount;
    // Bill rate equals all-in (no margin)
    const billRatePerHour = allInPerHour;

    const hWeek = clamp(hoursPerWeek, 0, 80);
    const wYear = clamp(weeksPerYear, 0, 52);

    const hoursYear = hWeek * wYear;
    const monthlyHours = hoursYear / 12;

    return {
      base,
      employersCosts,
      vacationAllowance,
      reserves,
      feeAmount,
      costPerHour,
      allInPerHour,
      billRatePerHour,
      monthlyHours,
      monthlyAllIn: allInPerHour * monthlyHours,
      monthlyBill: billRatePerHour * monthlyHours,
      hoursYear,
    };
  }, [grossHourly, erPct, vacPct, resPct, payrollFeePct, hoursPerWeek, weeksPerYear, country]);

  // Re-usable input
  const Num = ({
    label,
    value,
    onChange,
    step = 0.1,
    min = 0,
    prefix,
    suffix,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    step?: number;
    min?: number;
    prefix?: string;
    suffix?: string;
  }) => {
    const [localValue, setLocalValue] = useState<string>(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);
    const isFocusedRef = useRef<boolean>(false);
    
    // Sync local value when prop value changes (but not when user is typing)
    useEffect(() => {
      if (!isFocusedRef.current) {
        setLocalValue(value.toString());
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setLocalValue(inputValue);
      
      // Only update parent if it's a valid number
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue) && inputValue !== '' && inputValue !== '-') {
        onChange(numValue);
      }
    };

    const handleFocus = () => {
      isFocusedRef.current = true;
    };

    const handleBlur = () => {
      isFocusedRef.current = false;
      // On blur, ensure we have a valid number
      const numValue = parseFloat(localValue);
      if (isNaN(numValue) || numValue < min) {
        const validValue = min;
        setLocalValue(validValue.toString());
        onChange(validValue);
      } else {
        setLocalValue(numValue.toString());
        onChange(numValue);
      }
    };

    return (
      <label className="block">
        <span className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</span>
        <div className="relative rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 transition-all">
          {prefix ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <span className="text-base font-medium">{prefix}</span>
            </div>
          ) : null}
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`block w-full rounded-lg border-0 bg-white py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 transition-all ${prefix ? "pl-10" : "pl-3"} ${suffix ? "pr-10" : "pr-3"}`}
          />
          {suffix ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              <span className="text-sm font-medium">{suffix}</span>
            </div>
          ) : null}
        </div>
      </label>
    );
  };

  return (
    <section id="payroll-calculator" className="relative isolate overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeInUp className="mb-10 sm:mb-12">
          <h2 className="text-base/7 font-semibold text-sky-600">{calcTranslations.badge || 'Cost Calculator'}</h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {calcTranslations.headText || 'Calculate your all-in payroll rate'}
          </p>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            {calcTranslations.subText || 'Choose a country preset (percentages + currency). After that, you can manually adjust each field.'}
          </p>
        </FadeInUp>

        {/* Land-toggle */}
        <SimpleFadeIn delay={0.1} className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex rounded-xl border border-gray-200 p-1 bg-white shadow-sm ring-1 ring-gray-900/5">
              {(["NL", "UK"] as Country[]).map((c) => (
                <motion.button
                  key={c}
                  type="button"
                  onClick={() => applyPreset(c)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${country === c 
                      ? "bg-sky-600 text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                  aria-pressed={country === c}
                >
                  {PRESETS[c].label}
                </motion.button>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={() => applyPreset(country)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors underline decoration-2 underline-offset-2"
              title={calcTranslations.resetButtonTitle || 'Restore the country presets (percentages/fee/currency).'}
            >
              {calcTranslations.resetButton || 'Reset to preset'}
            </motion.button>
          </div>
        </SimpleFadeIn>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Inputs */}
          <SimpleFadeIn delay={0.2} className="lg:col-span-5 xl:col-span-4">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow"
              >
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-600"></span>
                  {calcTranslations.sections?.personnelData || 'Personnel Data'}
                </h3>
                <Num label={calcTranslations.fields?.grossHourly || 'Gross hourly wage'} value={grossHourly} onChange={setGrossHourly} prefix={currency === "EUR" ? "€" : "£"} step={0.1} />
                <div className="grid grid-cols-2 gap-4">
                  <Num label={calcTranslations.fields?.hoursPerWeek || 'Hours per week'} value={hoursPerWeek} onChange={setHoursPerWeek} step={1} />
                  <Num label={calcTranslations.fields?.weeksPerYear || 'Weeks per year (effective)'} value={weeksPerYear} onChange={setWeeksPerYear} step={1} />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow"
              >
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-600"></span>
                  {calcTranslations.sections?.surchargesFees || 'Surcharges & fees'}
                </h3>
                <Num label={calcTranslations.fields?.employersCosts || 'Employer costs'} value={erPct} onChange={setErPct} suffix="×" step={0.01} />
                <div className="grid grid-cols-2 gap-4">
                  <Num label={calcTranslations.fields?.vacationPay || 'Vacation pay'} value={vacPct} onChange={setVacPct} suffix="×" step={0.01} />
                  <Num label={calcTranslations.fields?.reserves || 'Reserves'} value={resPct} onChange={setResPct} suffix="×" step={0.01} />
                </div>
                <div className="rounded-lg bg-sky-50 border border-sky-100 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{calcTranslations.fields?.payrollFee || 'Payroll fee (Junter)'}</p>
                      <p className="text-xs text-sky-700 mt-1">
                        {(payrollFeePct * 100).toFixed(1)}% ({calcTranslations.fields?.payrollFeeNote || 'Fixed rate'})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">{calcTranslations.tip?.text || 'Tip:'}</span> {calcTranslations.tip?.description || '"×" is a factor. 0.08 = 8%. Set to 0.00 to disable.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </SimpleFadeIn>

          {/* Results */}
          <SimpleFadeIn delay={0.3} className="lg:col-span-7 xl:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg ring-1 ring-gray-900/5"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-6">{calcTranslations.results?.title || 'Result (per hour)'}</h3>

              <SimpleStaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SimpleStaggerItem>
                  <KPI label={calcTranslations.results?.costPerHour || 'Cost per hour'} value={calc.costPerHour} money={money} />
                </SimpleStaggerItem>
                <SimpleStaggerItem>
                  <KPI label={calcTranslations.results?.allInPerHour || 'All-in (incl. payroll fee)'} value={calc.allInPerHour} money={money} highlight />
                </SimpleStaggerItem>
                <SimpleStaggerItem>
                  <KPI label={calcTranslations.results?.billRatePerHour || 'Billable rate per hour'} value={calc.billRatePerHour} money={money} />
                </SimpleStaggerItem>
              </SimpleStaggerContainer>

              <h4 className="mt-8 text-base font-semibold text-gray-900">{calcTranslations.results?.breakdown || 'Breakdown'}</h4>
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 ring-1 ring-gray-900/5">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <Row label={calcTranslations.results?.grossHourly || 'Gross hourly wage'} val={calc.base} money={money} />
                    <Row label={`${calcTranslations.results?.employersCosts || 'Employer costs'} (${(erPct*100).toFixed(1)}%)`} val={calc.employersCosts} money={money} />
                    <Row label={`${calcTranslations.results?.vacationPay || 'Vacation pay'} (${(vacPct*100).toFixed(1)}%)`} val={calc.vacationAllowance} money={money} />
                    <Row label={`${calcTranslations.results?.reserves || 'Reserves'} (${(resPct*100).toFixed(1)}%)`} val={calc.reserves} money={money} />
                    <Row label={calcTranslations.results?.subtotal || 'Subtotal (cost price)'} val={calc.costPerHour} money={money} bold />
                    <Row label={`${calcTranslations.results?.payrollFee || 'Payroll fee'} (${(payrollFeePct*100).toFixed(1)}%)`} val={calc.feeAmount} money={money} />
                    <Row label={calcTranslations.results?.allInPerHour || 'All-in per hour'} val={calc.allInPerHour} money={money} bold />
                    <Row label={calcTranslations.results?.billRatePerHour || 'Billable rate per hour'} val={calc.billRatePerHour} money={money} bold />
                  </tbody>
                </table>
              </div>

              <h4 className="mt-8 text-base font-semibold text-gray-900">{calcTranslations.results?.monthlyApprox || 'Per month (approximation)'}</h4>
              <SimpleStaggerContainer className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SimpleStaggerItem>
                  <Card label={calcTranslations.results?.monthlyHours || 'Monthly hours (≈)'} value={calc.monthlyHours.toFixed(0)} suffix={lang === 'nl' ? ' uur' : ' hours'} />
                </SimpleStaggerItem>
                <SimpleStaggerItem>
                  <Card label={calcTranslations.results?.allInPerMonth || 'All-in per month (≈)'} value={money(calc.monthlyAllIn)} />
                </SimpleStaggerItem>
                <SimpleStaggerItem>
                  <Card label={calcTranslations.results?.billPerMonth || 'Billable per month (≈)'} value={money(calc.monthlyBill)} />
                </SimpleStaggerItem>
                <SimpleStaggerItem>
                  <Card label={calcTranslations.results?.yearlyHours || 'Yearly hours (effective)'} value={calc.hoursYear.toFixed(0)} suffix={lang === 'nl' ? ' uur' : ' hours'} />
                </SimpleStaggerItem>
              </SimpleStaggerContainer>

              <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">{calcTranslations.disclaimer?.label || 'Disclaimer:'}</span> {calcTranslations.disclaimer?.text || 'indicative. Percentages may vary per collective agreement/sector/country/allowances. Contact us for a quote.'}
                </p>
              </div>
            </motion.div>
          </SimpleFadeIn>
        </div>
      </div>
    </section>
  );
}

function KPI({ label, value, money, highlight = false }: { label: string; value: number; money: (n: number) => string; highlight?: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className={`rounded-xl border transition-all duration-200 ${
        highlight 
          ? "border-sky-300 bg-gradient-to-br from-sky-50 to-sky-100/50 shadow-md ring-2 ring-sky-200/50" 
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      } p-5`}
    >
      <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? "text-sky-700" : "text-gray-900"}`}>
        {money(value)}
      </div>
    </motion.div>
  );
}
function Row({ label, val, money, bold = false }: { label: string; val: number; money: (n: number) => string; bold?: boolean }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${bold ? "bg-sky-50/50 border-t border-b border-sky-100" : "hover:bg-gray-50/50"} transition-colors`}
    >
      <td className={`px-4 py-3.5 ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>{label}</td>
      <td className={`px-4 py-3.5 text-right ${bold ? "font-bold text-sky-700 text-lg" : "font-medium text-gray-700"}`}>
        {money(val)}
      </td>
    </motion.tr>
  );
}
function Card({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>
      <div className="text-2xl font-bold text-gray-900">
        {value}{suffix ? <span className="text-sm font-normal text-gray-500 ml-1"> {suffix}</span> : null}
      </div>
    </motion.div>
  );
}
