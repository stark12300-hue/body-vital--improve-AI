import React, { useState, useEffect } from "react";
import { FullPlan, ProgressEntry, UserProfile, WeeklyCheckIn } from "../types";
import {
  AlertCircle,
  Apple,
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Dumbbell,
  FileDown,
  FileText,
  Flame,
  Globe,
  HardDrive,
  HeartPulse,
  Info,
  Laptop,
  Layers,
  Printer,
  QrCode,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Upload,
  Utensils,
  X,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface DownloadAndInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  plan: FullPlan;
  progressLogs: ProgressEntry[];
  weeklyCheckIns: WeeklyCheckIn[];
  onImportData?: (imported: {
    profile?: UserProfile;
    plan?: FullPlan;
    progressLogs?: ProgressEntry[];
    weeklyCheckIns?: WeeklyCheckIn[];
  }) => void;
}

export const DownloadAndInstallModal: React.FC<DownloadAndInstallModalProps> = ({
  isOpen,
  onClose,
  profile,
  plan,
  progressLogs,
  weeklyCheckIns,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<"install" | "pdf" | "backup">("install");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [devicePlatform, setDevicePlatform] = useState<"android" | "ios" | "desktop">("android");
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>("");

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDevicePlatform("ios");
    } else if (/android/.test(userAgent)) {
      setDevicePlatform("android");
    } else {
      setDevicePlatform("desktop");
    }

    // Check if running in standalone mode (already installed)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      confetti({ particleCount: 80, spread: 60 });
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (devicePlatform === "ios") {
      alert("iPhone / iPad par install karne ke liye Safari ke Share button par tap karke 'Add to Home Screen' select karein.");
    } else {
      alert("Aapke browser menu (3 dots) par tap karke 'Install App' ya 'Add to Home screen' par click karein.");
    }
  };

  // Generate printable document & trigger print / PDF save
  const handlePrintPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const { summary, workoutPlan, dietChart } = plan;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>FitForge AI - ${profile.name || "Athlete"} Workout & Diet Plan</title>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            line-height: 1.4;
          }
          .header {
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 16px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .title { font-size: 24px; font-weight: 800; color: #1e1b4b; margin: 0; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .badge {
            background: #4f46e5;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
          }
          .card-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
          .card-value { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          .section-title {
            font-size: 16px;
            font-weight: 800;
            color: #1e1b4b;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 6px;
            margin-top: 24px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 16px;
          }
          th {
            background: #f1f5f9;
            text-align: left;
            padding: 8px 10px;
            font-weight: 700;
            color: #334155;
            border: 1px solid #e2e8f0;
          }
          td {
            padding: 8px 10px;
            border: 1px solid #e2e8f0;
            color: #334155;
          }
          .day-box {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 12px;
            page-break-inside: avoid;
          }
          .day-title { font-size: 14px; font-weight: 800; color: #4f46e5; margin-bottom: 6px; }
          .safety-box {
            background: #fff1f2;
            border: 1px solid #fecdd3;
            border-radius: 10px;
            padding: 12px;
            font-size: 12px;
            color: #9f1239;
            margin-bottom: 16px;
          }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">FitForge AI - Custom Fitness & Diet Blueprint</h1>
            <div class="subtitle">
              Athlete: <strong>${profile.name || "User"}</strong> (${profile.age}y, ${profile.weight}kg &rarr; Goal: ${profile.targetWeight}kg) | Plan: ${profile.goal.replace("_", " ")}
            </div>
          </div>
          <span class="badge">Active Protocol</span>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-label">Daily Calories</div>
            <div class="card-value">${summary.caloriesTarget} kcal</div>
          </div>
          <div class="card">
            <div class="card-label">Protein Goal</div>
            <div class="card-value">${summary.proteinGrams} g</div>
          </div>
          <div class="card">
            <div class="card-label">Carbs Energy</div>
            <div class="card-value">${summary.carbsGrams} g</div>
          </div>
          <div class="card">
            <div class="card-label">Healthy Fats</div>
            <div class="card-value">${summary.fatsGrams} g</div>
          </div>
        </div>

        ${
          profile.healthIssues && profile.healthIssues.length > 0
            ? `
            <div class="safety-box">
              <strong>⚠️ Health Precautions & Monitored Conditions:</strong> ${profile.healthIssues.join(", ")}
              <br><small>${summary.healthPrecautions?.join(" • ") || "Follow joint-safe exercise alternatives at all times."}</small>
            </div>
            `
            : ""
        }

        <div class="section-title">🍽️ Customized Daily Diet Chart (${dietChart.dietType || "Targeted Nutrition"})</div>
        <table>
          <thead>
            <tr>
              <th style="width: 20%;">Meal & Timing</th>
              <th style="width: 55%;">Food Items & Swaps</th>
              <th style="width: 15%;">Macros</th>
              <th style="width: 10%;">Calories</th>
            </tr>
          </thead>
          <tbody>
            ${dietChart.meals
              .map(
                (m) => `
              <tr>
                <td><strong>${m.mealName}</strong><br><small style="color:#64748b;">${m.timing}</small></td>
                <td>
                  ${m.items
                    .map(
                      (i) => `<div>• ${i.food} <span style="color:#64748b;">(${i.protein}g P / ${i.calories} kcal)</span>${i.alternative ? ` <small style="color:#059669;">[Alt: ${i.alternative}]</small>` : ""}</div>`
                    )
                    .join("")}
                  ${m.notes ? `<div style="font-size: 11px; color:#475569; margin-top: 4px;"><em>💡 Tip: ${m.notes}</em></div>` : ""}
                </td>
                <td><strong style="color:#059669;">${m.mealProtein}g Prot</strong></td>
                <td><strong>${m.mealCalories} kcal</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="section-title">🏋️ 7-Day Workout Routine (${workoutPlan.splitName})</div>
        ${workoutPlan.days
          .map(
            (d) => `
          <div class="day-box">
            <div class="day-title">Day ${d.dayNumber}: ${d.dayName} - ${d.focus}</div>
            ${
              d.isRestDay
                ? `<div style="font-size: 12px; color: #059669;">🛌 Active Rest & Muscle Recovery Day. Stay hydrated and hit daily protein.</div>`
                : `
                <table>
                  <thead>
                    <tr>
                      <th style="width: 30%;">Exercise Name</th>
                      <th style="width: 15%;">Sets × Reps</th>
                      <th style="width: 25%;">Target Muscle</th>
                      <th style="width: 30%;">Form Tips & Safety</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${d.exercises
                      .map(
                        (ex) => `
                      <tr>
                        <td><strong>${ex.name}</strong></td>
                        <td><span style="font-weight: 700; color: #4f46e5;">${ex.sets} × ${ex.reps}</span></td>
                        <td>${ex.targetMuscle}</td>
                        <td>${ex.formTips}${ex.safetyNote ? `<br><small style="color: #e11d48;">🛡️ ${ex.safetyNote}</small>` : ""}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              `
            }
          </div>
        `
          )
          .join("")}

        ${
          dietChart.supplementsGuidance && dietChart.supplementsGuidance.length > 0
            ? `
          <div class="section-title">💊 Evidence-Based Supplementation</div>
          <table>
            <thead>
              <tr>
                <th>Supplement</th>
                <th>Purpose</th>
                <th>Dosage & Best Timing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${dietChart.supplementsGuidance
                .map(
                  (s) => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.purpose}</td>
                  <td>${s.dosageTiming}</td>
                  <td>${s.isOptional ? "Optional" : "Recommended"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          `
            : ""
        }

        <div style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          Generated with FitForge AI Coach • Consult a healthcare professional before starting extreme fitness programs.
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Download Plain Text Plan
  const handleDownloadTextPlan = () => {
    const { summary, workoutPlan, dietChart } = plan;
    let txt = `=========================================\n`;
    txt += `FITFORGE AI - WORKOUT & DIET BLUEPRINT\n`;
    txt += `=========================================\n`;
    txt += `Athlete: ${profile.name || "User"} (${profile.age}y, ${profile.weight}kg -> Target: ${profile.targetWeight}kg)\n`;
    txt += `Goal: ${profile.goal}\n`;
    txt += `Health Precautions: ${profile.healthIssues.join(", ") || "None"}\n\n`;

    txt += `[DAILY MACROS TARGET]\n`;
    txt += `Calories: ${summary.caloriesTarget} kcal\n`;
    txt += `Protein: ${summary.proteinGrams}g\n`;
    txt += `Carbs: ${summary.carbsGrams}g\n`;
    txt += `Fats: ${summary.fatsGrams}g\n`;
    txt += `Daily Water: ${summary.waterLiters} Liters\n\n`;

    txt += `[DIET CHART: ${dietChart.dietType}]\n`;
    dietChart.meals.forEach((m, idx) => {
      txt += `\nMeal ${idx + 1}: ${m.mealName} (${m.timing}) - [${m.mealProtein}g Protein | ${m.mealCalories} kcal]\n`;
      m.items.forEach((item) => {
        txt += `  - ${item.food} (${item.protein}g P, ${item.calories} kcal)${item.alternative ? ` [Alt: ${item.alternative}]` : ""}\n`;
      });
      if (m.notes) txt += `  Note: ${m.notes}\n`;
    });

    txt += `\n=========================================\n`;
    txt += `[7-DAY WORKOUT SPLIT: ${workoutPlan.splitName}]\n`;
    txt += `=========================================\n`;
    workoutPlan.days.forEach((d) => {
      txt += `\nDay ${d.dayNumber}: ${d.dayName} - ${d.focus}\n`;
      if (d.isRestDay) {
        txt += `  - Rest & Muscle Recovery Day\n`;
      } else {
        d.exercises.forEach((ex, exIdx) => {
          txt += `  ${exIdx + 1}. ${ex.name} | ${ex.sets} sets x ${ex.reps} | Focus: ${ex.targetMuscle}\n`;
          txt += `     Form: ${ex.formTips}\n`;
          if (ex.safetyNote) txt += `     Safety: ${ex.safetyNote}\n`;
        });
      }
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FitForge_Workout_Diet_Plan_${profile.name || "Athlete"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download Full JSON Backup
  const handleDownloadJsonBackup = () => {
    const fullData = {
      app: "FitForge AI",
      exportedAt: new Date().toISOString(),
      profile,
      plan,
      progressLogs,
      weeklyCheckIns,
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FitForge_Backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.profile || json.plan) {
          if (onImportData) {
            onImportData({
              profile: json.profile,
              plan: json.plan,
              progressLogs: json.progressLogs,
              weeklyCheckIns: json.weeklyCheckIns,
            });
          }
          setImportStatus("Data successfully restored! 🎉");
          confetti({ particleCount: 70, spread: 50 });
        } else {
          setImportStatus("Invalid backup file format.");
        }
      } catch (err) {
        setImportStatus("Failed to read JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/25">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Download & Install FitForge App
              </h2>
              <p className="text-xs text-slate-400">
                Apne phone par app install karein aur workout/diet chart PDF download karein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-4 pt-2">
          <button
            onClick={() => setActiveTab("install")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === "install"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App (PWA / Mobile)</span>
          </button>

          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === "pdf"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>Download Plan (PDF / Text)</span>
          </button>

          <button
            onClick={() => setActiveTab("backup")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === "backup"
                ? "border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Backup / Sync Data</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: INSTALL APP */}
          {activeTab === "install" && (
            <div className="space-y-5">
              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">FitForge Mobile App</span>
                      {isInstalled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          INSTALLED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          OFFLINE READY
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fast load speed, offline workout logs, no PlayStore download required.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  {isInstalled ? "Open / Already Installed" : "Download & Install Now"}
                </button>
              </div>

              {/* Platform Selector & Step-by-Step Guidance */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Device Specific Instructions:
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setDevicePlatform("android")}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      devicePlatform === "android"
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Android Phone</span>
                  </button>

                  <button
                    onClick={() => setDevicePlatform("ios")}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      devicePlatform === "ios"
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/40 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Apple className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">iPhone / Safari</span>
                  </button>

                  <button
                    onClick={() => setDevicePlatform("desktop")}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      devicePlatform === "desktop"
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/40 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Laptop className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">PC / Laptop</span>
                  </button>
                </div>

                {/* Android Steps */}
                {devicePlatform === "android" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                        1
                      </span>
                      Android Chrome / Edge mein Install karne ka tareeqa:
                    </h4>
                    <ol className="space-y-2 pl-4 list-decimal text-slate-300 leading-relaxed">
                      <li>
                        Upar diye gaye <strong>&quot;Download & Install Now&quot;</strong> button par tap karein.
                      </li>
                      <li>
                        Agar prompt na dikhe, toh Chrome ke top-right <strong>3 Dots (⋮)</strong> menu par tap karein.
                      </li>
                      <li>
                        <strong>&quot;Install app&quot;</strong> ya <strong>&quot;Add to Home screen&quot;</strong> select karein.
                      </li>
                      <li>
                        App aapke phone ke home screen par as a native app icon add ho jayega!
                      </li>
                    </ol>
                  </div>
                )}

                {/* iPhone Steps */}
                {devicePlatform === "ios" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[11px]">
                        1
                      </span>
                      iPhone / iPad (Safari) mein Install karne ka tareeqa:
                    </h4>
                    <ol className="space-y-2 pl-4 list-decimal text-slate-300 leading-relaxed">
                      <li>
                        Safari browser mein bottom bar par <strong>Share Icon</strong> (square with arrow ⎋) par tap karein.
                      </li>
                      <li>
                        Neeche scroll karein aur <strong>&quot;Add to Home Screen&quot; (होम स्क्रीन में जोड़ें)</strong> par tap karein.
                      </li>
                      <li>
                        Top right corner par <strong>&quot;Add&quot;</strong> dabayein.
                      </li>
                      <li>
                        FitForge AI aapke iPhone apps list mein bina kisi AppStore login ke save ho jayega.
                      </li>
                    </ol>
                  </div>
                )}

                {/* Desktop Steps */}
                {devicePlatform === "desktop" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[11px]">
                        1
                      </span>
                      Desktop / Laptop Chrome / Edge par Install:
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Browser ke URL bar ke right corner mein <strong>Install Icon (⊕ ya monitor icon)</strong> par click karein ya upar ka button press karein. Yeh desktop app ban kar desktop icon ke sath launch hoga.
                    </p>
                  </div>
                )}
              </div>

              {/* Share link quick button */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Share2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Phone par link share karke open karein:</span>
                </div>
                <button
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  {copiedText ? "Copied Link!" : "Copy App Link"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD PDF / TEXT */}
          {activeTab === "pdf" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <FileDown className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Full Workout & Diet Chart PDF</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Apna complete personalized diet chart, meal timing, daily workout split aur supplement dosage sheet printable PDF ya text file mein save karein taaki gym mein bina phone network ke bhi use kar sakein.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Print/Save PDF */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
                      <Printer className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Printable PDF Blueprint</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Professional table format with macros, meal timings, exercises & sets.
                    </p>
                  </div>
                  <button
                    onClick={handlePrintPdf}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download / Save as PDF
                  </button>
                </div>

                {/* Text Plan */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold mb-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Text Summary File (.txt)</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Quick copy for WhatsApp notes, gym journal, or offline notepad.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadTextPlan}
                    className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileDown className="w-4 h-4" /> Download Text File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BACKUP / RESTORE DATA */}
          {activeTab === "backup" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Complete Data Backup & Device Sync</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Aapka workout progress, weekly check-in logs, weight metrics aur custom diet chart ko safely backup karein ya doosre mobile/device par transfer karein.
                  </p>
                </div>
              </div>

              {importStatus && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {importStatus}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Export Backup */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" /> Export Backup (.JSON)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Download all saved weight records, workout sets, and diet settings.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadJsonBackup}
                    className="w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download Backup File
                  </button>
                </div>

                {/* Import Backup */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-400" /> Restore from Backup
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload previously downloaded `.json` file to restore your progress.
                    </p>
                  </div>
                  <label className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    Select JSON File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJsonFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Free & Offline-Ready Progressive Web App</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
