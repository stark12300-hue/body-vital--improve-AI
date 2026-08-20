import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini client with recommended telemetry header
const getGenAI = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Generate Initial Workout & Diet Plan
app.post("/api/generate-plan", async (req, res) => {
  try {
    const profile = req.body;
    const ai = getGenAI();

    const prompt = `You are an elite bodybuilding coach, certified sports nutritionist, and physical rehabilitation specialist.
Generate a comprehensive, scientifically-backed, and personalized Bodybuilding Workout Plan and Nutrition Diet Chart for this person.

User Profile:
- Name/Alias: ${profile.name || "Athlete"}
- Age: ${profile.age} years, Gender: ${profile.gender}
- Height: ${profile.height} cm, Weight: ${profile.weight} kg, Target Weight: ${profile.targetWeight} kg
- Primary Goal: ${profile.goal} (e.g., Muscle Building / Hypertrophy, Lean Bulking, Fat Loss & Muscle Retention, Strength, Recomposition)
- Experience Level: ${profile.experienceLevel}
- Workout Location & Equipment: ${profile.workoutLocation} (${profile.equipment || "Standard gym equipment"})
- Available Days/Week: ${profile.daysPerWeek} days, Duration per session: ${profile.workoutDuration} minutes
- Dietary Preference: ${profile.dietPreference} (e.g., Vegetarian, Eggetarian, Non-Vegetarian, Vegan, Jain, etc.)
- Regional / Food Style: ${profile.cuisinePreference || "Indian & Balanced"}
- Budget Preference: ${profile.budgetPreference || "Affordable / Standard"}
- Specific Health Issues & Injuries: ${profile.healthIssues && profile.healthIssues.length > 0 ? profile.healthIssues.join(", ") : "None reported"}
- Medical/Injury Notes: ${profile.healthNotes || "None"}
- Language Preference: Hinglish & English (Clear, encouraging, easy for Indian & global users to understand with Hindi/Hinglish contextual notes where helpful)

IMPORTANT HEALTH SAFETY RULES:
- If user has Back/Spine pain or slip disc: AVOID heavy spinal compression (e.g., replace heavy barbell squats or deadlifts with supported alternatives like chest-supported rows, leg press, lunges, or seated exercises).
- If user has Knee issues: AVOID deep heavy knee flexion, provide joint-friendly quad/hamstring exercises (box squats, glute bridges, leg curls).
- If user has Shoulder impingement: AVOID behind-the-neck presses or extreme flared bench presses, substitute neutral-grip dumbbell presses, floor presses.
- If user has High BP, Diabetes, Thyroid, Uric Acid, etc.: Tailor diet accordingly (low sodium, complex low-GI carbs, low purine, etc.).

Return ONLY a valid JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                caloriesTarget: { type: Type.NUMBER, description: "Daily target calories" },
                proteinGrams: { type: Type.NUMBER, description: "Daily protein in grams" },
                carbsGrams: { type: Type.NUMBER, description: "Daily carbs in grams" },
                fatsGrams: { type: Type.NUMBER, description: "Daily fats in grams" },
                waterLiters: { type: Type.NUMBER, description: "Recommended daily water in liters" },
                bmr: { type: Type.NUMBER, description: "Estimated BMR" },
                tdee: { type: Type.NUMBER, description: "Estimated TDEE" },
                coachInsight: { type: Type.STRING, description: "Detailed strategy breakdown in friendly Hinglish/English" },
                healthPrecautions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Specific cautions based on user's health issues"
                }
              },
              required: ["caloriesTarget", "proteinGrams", "carbsGrams", "fatsGrams", "waterLiters", "coachInsight", "healthPrecautions"]
            },
            workoutPlan: {
              type: Type.OBJECT,
              properties: {
                splitName: { type: Type.STRING, description: "Name of the split e.g., Push-Pull-Legs, Upper-Lower, Bro Split" },
                overview: { type: Type.STRING, description: "Overview of weekly training regimen" },
                days: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dayNumber: { type: Type.INTEGER, description: "1 to 7" },
                      dayName: { type: Type.STRING, description: "Monday / Day 1" },
                      focus: { type: Type.STRING, description: "e.g., Chest & Triceps (Push), Back & Biceps (Pull), Legs & Core, Active Rest" },
                      isRestDay: { type: Type.BOOLEAN },
                      warmup: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-10 min warmup steps" },
                      cooldown: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cool down stretches" },
                      exercises: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING, description: "Exercise name e.g., Incline Dumbbell Press" },
                            targetMuscle: { type: Type.STRING, description: "e.g., Upper Chest, Front Delts" },
                            sets: { type: Type.INTEGER, description: "Recommended sets (e.g. 3-4)" },
                            reps: { type: Type.STRING, description: "Recommended rep range e.g. 8-12 reps" },
                            restSeconds: { type: Type.INTEGER, description: "Rest between sets in seconds (e.g. 60-90)" },
                            formTips: { type: Type.STRING, description: "Form cue and breathing tip" },
                            safetyNote: { type: Type.STRING, description: "Health/injury safe adjustment or caution" },
                            alternativeExercise: { type: Type.STRING, description: "Safe swap alternative" }
                          },
                          required: ["name", "targetMuscle", "sets", "reps", "restSeconds", "formTips"]
                        }
                      }
                    },
                    required: ["dayNumber", "dayName", "focus", "isRestDay", "exercises"]
                  }
                }
              },
              required: ["splitName", "overview", "days"]
            },
            dietChart: {
              type: Type.OBJECT,
              properties: {
                dietType: { type: Type.STRING, description: "e.g. High Protein Vegetarian Bodybuilding Diet" },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      mealName: { type: Type.STRING, description: "e.g. Breakfast / Nashta, Lunch / Dopahar, Evening Snack, Pre-Workout, Post-Workout, Dinner" },
                      timing: { type: Type.STRING, description: "e.g. 8:00 AM" },
                      items: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            food: { type: Type.STRING, description: "Food item with exact portion e.g. 100g Paneer / 4 Egg Whites / 50g Oats with 1 Banana" },
                            protein: { type: Type.NUMBER, description: "Protein in grams" },
                            calories: { type: Type.NUMBER, description: "Calories in kcal" },
                            alternative: { type: Type.STRING, description: "Budget or preference substitute" }
                          },
                          required: ["food", "protein", "calories"]
                        }
                      },
                      mealProtein: { type: Type.NUMBER },
                      mealCalories: { type: Type.NUMBER },
                      notes: { type: Type.STRING, description: "Cooking tip or digestion guidance" }
                    },
                    required: ["mealName", "timing", "items", "mealProtein", "mealCalories"]
                  }
                },
                supplementsGuidance: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "e.g. Whey Protein, Creatine Monohydrate, Multivitamin, Fish Oil / Flaxseed, Ashwagandha" },
                      purpose: { type: Type.STRING },
                      dosageTiming: { type: Type.STRING },
                      isOptional: { type: Type.BOOLEAN }
                    },
                    required: ["name", "purpose", "dosageTiming", "isOptional"]
                  }
                },
                generalTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["dietType", "meals", "supplementsGuidance", "generalTips"]
            }
          },
          required: ["summary", "workoutPlan", "dietChart"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error generating plan:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate plan" });
  }
});

// API: AI Chat Support & Fitness Assistant
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message, chatHistory, userProfile, currentPlan, progressLogs } = req.body;
    const ai = getGenAI();

    const systemInstruction = `You are "FitForge AI Coach" (Ustaad / Guru / Coach), an expert bodybuilding coach, sports scientist, and nutrition doctor.
You provide friendly, actionable, scientifically accurate advice in Hinglish / Hindi / English (matching user's language).

User Context:
- User Profile: ${JSON.stringify(userProfile || {})}
- Health Issues / Injuries: ${JSON.stringify(userProfile?.healthIssues || [])} - ${userProfile?.healthNotes || "None"}
- Target Goal: ${userProfile?.goal || "Muscle Building"}
- Current Target Calories: ${currentPlan?.summary?.caloriesTarget || "N/A"} kcal, Protein: ${currentPlan?.summary?.proteinGrams || "N/A"}g
- Recent Progress: ${JSON.stringify(progressLogs?.slice(-3) || [])}

Capabilities:
1. Answer gym & bodybuilding exercise queries, form corrections, daily routine questions.
2. Provide budget Indian/global diet substitutes (e.g. Paneer vs Soya vs Eggs vs Dal vs Tofu).
3. Always guard against injuring health conditions (back pain, knee pain, shoulder impingement, high BP, diabetes, uric acid).
4. Provide motivation, discipline reminders, recovery advice, and supplement safety.
5. If the user asks to adjust their weekly diet or workout due to weight changes or injury, provide specific calorie/macro changes and updated meals.
Be concise, practical, highly motivating, and format with clear bullet points and bold highlights.`;

    const contents = [];

    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory.slice(-8)) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ success: true, reply: response.text || "Main aapki madad karne ke liye tayyar hoon. Kripya apna sawal dobara puchiye!" });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to process chat message" });
  }
});

// API: Weekly Progress Review & Dynamic Diet/Workout Update
app.post("/api/update-weekly-diet", async (req, res) => {
  try {
    const { userProfile, currentPlan, weeklyCheckIn, progressHistory } = req.body;
    const ai = getGenAI();

    const prompt = `You are an elite bodybuilding coach and clinical sports nutritionist.
Perform a thorough WEEKLY PROGRESS REVIEW and generate an updated, calibrated Diet Chart & Workout modifications for the upcoming week based on actual user results.

User Profile:
- Goal: ${userProfile?.goal}
- Starting Weight: ${userProfile?.weight} kg, Target Weight: ${userProfile?.targetWeight} kg
- Health Issues: ${JSON.stringify(userProfile?.healthIssues || [])}

Previous Week Plan:
- Previous Calories: ${currentPlan?.summary?.caloriesTarget} kcal
- Previous Protein: ${currentPlan?.summary?.proteinGrams}g, Carbs: ${currentPlan?.summary?.carbsGrams}g, Fats: ${currentPlan?.summary?.fatsGrams}g

This Week's Check-in Data:
- Current Measured Weight: ${weeklyCheckIn?.currentWeight} kg (Change: ${weeklyCheckIn?.weightDifference > 0 ? "+" : ""}${weeklyCheckIn?.weightDifference} kg)
- Workout Adherence: ${weeklyCheckIn?.workoutAdherence || "100"}%
- Diet Adherence: ${weeklyCheckIn?.dietAdherence || "100"}%
- Energy & Strength Levels: ${weeklyCheckIn?.energyLevel || "Normal"}
- Muscle Soreness / Joint Recovery: ${weeklyCheckIn?.recoveryStatus || "Good"}
- Health / Injury Updates: ${weeklyCheckIn?.healthStatusUpdate || "No new complaints"}
- User Feedback / Notes: ${weeklyCheckIn?.userNotes || "None"}

Progress History (past 4 entries):
${JSON.stringify(progressHistory?.slice(-4) || [])}

TASK:
1. Analyze if the user is on track with their goal (e.g., if Bulking and weight didn't rise, increase calories by +200-300 kcal; if Fat Loss and weight is stalled for 2 weeks, adjust -150 kcal or tweak carb cycling; if too rapid weight drop, protect muscle by increasing protein and calories slightly; if joint ache is reported, modify affected exercises).
2. Generate an updated Weekly Analysis & Action Plan in Hinglish/English.
3. Return updated Summary, updated Meals list, and updated Exercise tweaks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklyAnalysis: {
              type: Type.OBJECT,
              properties: {
                verdict: { type: Type.STRING, description: "e.g., Excellent Progress / Plateau Detected / Calorie Surplus Needed / Perfect Recomp" },
                weightTrendAnalysis: { type: Type.STRING, description: "Analysis of weight and body changes in Hinglish/English" },
                calorieAdjustment: { type: Type.STRING, description: "e.g., +200 kcal or -150 kcal or Maintained" },
                coachWeeklyAdvice: { type: Type.STRING, description: "Actionable advice for the upcoming 7 days in inspiring tone" },
                healthRecoveryNotes: { type: Type.STRING, description: "Advice on soreness, joints, or health conditions" }
              },
              required: ["verdict", "weightTrendAnalysis", "calorieAdjustment", "coachWeeklyAdvice"]
            },
            updatedSummary: {
              type: Type.OBJECT,
              properties: {
                caloriesTarget: { type: Type.NUMBER },
                proteinGrams: { type: Type.NUMBER },
                carbsGrams: { type: Type.NUMBER },
                fatsGrams: { type: Type.NUMBER },
                waterLiters: { type: Type.NUMBER },
                coachInsight: { type: Type.STRING }
              },
              required: ["caloriesTarget", "proteinGrams", "carbsGrams", "fatsGrams", "waterLiters", "coachInsight"]
            },
            updatedDietMeals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealName: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        food: { type: Type.STRING },
                        protein: { type: Type.NUMBER },
                        calories: { type: Type.NUMBER },
                        alternative: { type: Type.STRING }
                      },
                      required: ["food", "protein", "calories"]
                    }
                  },
                  mealProtein: { type: Type.NUMBER },
                  mealCalories: { type: Type.NUMBER },
                  notes: { type: Type.STRING }
                },
                required: ["mealName", "timing", "items", "mealProtein", "mealCalories"]
              }
            },
            workoutModifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific adjustments for next week's workouts (e.g. Progressive overload on bench press, swap lunges due to knee comfort, add 10 min incline walk)"
            }
          },
          required: ["weeklyAnalysis", "updatedSummary", "updatedDietMeals", "workoutModifications"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error updating weekly diet:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to update weekly diet" });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitForge Server running on http://localhost:${PORT}`);
  });
}

startServer();
