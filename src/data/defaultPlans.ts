import { FullPlan, UserProfile } from "../types";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Aman",
  age: 24,
  gender: "male",
  height: 175,
  weight: 70,
  targetWeight: 75,
  goal: "muscle_building",
  experienceLevel: "intermediate",
  workoutLocation: "gym",
  equipment: "Dumbbells, Barbells, Cables, Machines",
  daysPerWeek: 5,
  workoutDuration: 60,
  dietPreference: "veg",
  cuisinePreference: "Indian (Dal, Roti, Rice, Paneer, Soya, Oats)",
  budgetPreference: "budget_friendly",
  healthIssues: ["Lower Back Soreness"],
  healthNotes: "Occasional lower back stiffness after heavy deadlifts, prefer joint-safe back exercises.",
};

export const SAMPLE_FULL_PLAN: FullPlan = {
  id: "initial-plan-1",
  createdAt: new Date().toISOString(),
  version: 1,
  summary: {
    caloriesTarget: 2650,
    proteinGrams: 140,
    carbsGrams: 330,
    fatsGrams: 65,
    waterLiters: 3.8,
    bmr: 1680,
    tdee: 2350,
    coachInsight: "70kg se 75kg lean muscle mass gain karne ke liye daily ~300 kcal clean surplus aur 140g protein (2g/kg) plan kiya gaya hai. Lower back safety ke liye heavy spinal loading ke bajaye chest-supported rows aur safe compounds rakhe gaye hain.",
    healthPrecautions: [
      "Heavy direct floor deadlifts ki jagah Chest-Supported Dumbbell Rows aur Lat Pulldowns karein.",
      "Squats ke waqt core tight rakhein aur belt ka prayog karein.",
      "Daily 3.8L paani digestion aur creatine uptake ke liye zaroori hai."
    ]
  },
  workoutPlan: {
    splitName: "5-Day Push / Pull / Legs / Upper / Lower Split (Back Safe)",
    overview: "Hypertrophy focused split designed to trigger optimal muscle protein synthesis while keeping lower back completely protected.",
    days: [
      {
        dayNumber: 1,
        dayName: "Monday",
        focus: "Push (Chest, Shoulders & Triceps)",
        isRestDay: false,
        warmup: ["5 mins Arm Circles & Band Dislocates", "2 sets Pushups (10 reps)", "Rotator Cuff Warmup with light dumbbell"],
        cooldown: ["Chest Doorway Stretch (60s)", "Overhead Tricep Stretch (45s per arm)"],
        exercises: [
          {
            id: "ex-1",
            name: "Incline Dumbbell Bench Press",
            targetMuscle: "Upper Chest & Anterior Deltoid",
            sets: 4,
            reps: "8-12 reps",
            restSeconds: 90,
            formTips: "Bench at 30-degree angle. Retract shoulder blades, control the negative for 2 seconds and squeeze at the top.",
            safetyNote: "Avoid flaring elbows to 90 degrees; keep them at a 45-degree angle to save shoulders."
          },
          {
            id: "ex-2",
            name: "Flat Dumbbell Press / Machine Chest Press",
            targetMuscle: "Mid & Lower Chest",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 75,
            formTips: "Full range of motion, deep stretch at bottom, explosive push without locking elbows harshly."
          },
          {
            id: "ex-3",
            name: "Seated Dumbbell Overhead Shoulder Press",
            targetMuscle: "Front & Side Deltoids",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 90,
            formTips: "Sit upright with back support to keep lumbar spine stable.",
            safetyNote: "Back support on bench removes lumbar shear stress."
          },
          {
            id: "ex-4",
            name: "Standing Dumbbell Lateral Raises",
            targetMuscle: "Lateral Deltoid (Boulder Shoulders)",
            sets: 4,
            reps: "12-15 reps",
            restSeconds: 60,
            formTips: "Slight forward lean. Lead with elbows, raise until parallel to floor, no swinging."
          },
          {
            id: "ex-5",
            name: "Rope Cable Tricep Pushdown",
            targetMuscle: "Triceps (Lateral & Medial Head)",
            sets: 3,
            reps: "12-15 reps",
            restSeconds: 60,
            formTips: "Keep elbows pinned to your ribs, spread the rope apart at the bottom for peak contraction."
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        focus: "Pull (Back, Rear Delts & Biceps - Spine Safe)",
        isRestDay: false,
        warmup: ["Cat-Cow Spine Mobilization", "Band Pull-aparts (2x15)", "Light Lat Pulldowns"],
        cooldown: ["Dead Hangs on Bar (2x30s)", "Bicep Wall Stretch"],
        exercises: [
          {
            id: "ex-6",
            name: "Chest-Supported Incline Dumbbell Row",
            targetMuscle: "Lats, Rhomboids, Mid-Back",
            sets: 4,
            reps: "10-12 reps",
            restSeconds: 90,
            formTips: "Lie chest down on 45° incline bench. Pull elbows back towards hips. Takes 100% pressure off your lower back!",
            safetyNote: "Zero lower back strain due to chest support."
          },
          {
            id: "ex-7",
            name: "Wide-Grip Lat Pulldown",
            targetMuscle: "Upper Lats (V-Taper)",
            sets: 4,
            reps: "10-12 reps",
            restSeconds: 75,
            formTips: "Slight lean back (10°), pull bar to upper clavicle, squeeze shoulder blades down and back."
          },
          {
            id: "ex-8",
            name: "Seated Cable Row (Close Neutral Grip)",
            targetMuscle: "Mid Back Thickness",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 75,
            formTips: "Maintain neutral spine, drive elbows straight back, feel the deep stretch."
          },
          {
            id: "ex-9",
            name: "Face Pulls with Rope",
            targetMuscle: "Rear Delts & Rotator Cuff",
            sets: 4,
            reps: "15 reps",
            restSeconds: 60,
            formTips: "Pull towards forehead, rotate hands externally at finish."
          },
          {
            id: "ex-10",
            name: "Incline Dumbbell Bicep Curls",
            targetMuscle: "Biceps (Long Head Peak)",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 60,
            formTips: "Let arms hang straight down for deep bicep stretch, curl with controlled tempo."
          },
          {
            id: "ex-11",
            name: "Dumbbell Hammer Curls",
            targetMuscle: "Brachialis & Forearms (Arm Thickness)",
            sets: 3,
            reps: "12 reps",
            restSeconds: 60,
            formTips: "Palms facing each other, squeeze at peak."
          }
        ]
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        focus: "Legs & Core (Joint Safe)",
        isRestDay: false,
        warmup: ["Bodyweight Squats (2x15)", "Leg Swings (Front/Side)", "Glute Bridges (2x15)"],
        cooldown: ["Hamstring Seated Stretch", "Quad Stretch", "Cobra Pose"],
        exercises: [
          {
            id: "ex-12",
            name: "Leg Press (High & Medium Foot Placement)",
            targetMuscle: "Quadriceps & Glutes",
            sets: 4,
            reps: "10-12 reps",
            restSeconds: 90,
            formTips: "Keep lower back flat against pad at all times. Do not lock knees completely at top.",
            safetyNote: "Safely builds leg mass without compressive axial spine loading."
          },
          {
            id: "ex-13",
            name: "Dumbbell Romanian Deadlift (RDL)",
            targetMuscle: "Hamstrings & Glute-Ham Tie-in",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 90,
            formTips: "Soft knee bend, push hips far back as if touching a wall behind you. Stop when hips stop moving back.",
            safetyNote: "Keep dumbbells close to shins to avoid lumbar torque."
          },
          {
            id: "ex-14",
            name: "Seated Leg Extensions",
            targetMuscle: "Quad Teardrop (Vastus Medialis)",
            sets: 3,
            reps: "12-15 reps",
            restSeconds: 60,
            formTips: "1 second pause at full contraction, slow 2 second lowering."
          },
          {
            id: "ex-15",
            name: "Lying or Seated Leg Curls",
            targetMuscle: "Hamstrings",
            sets: 3,
            reps: "12-15 reps",
            restSeconds: 60,
            formTips: "Dorsiflex ankles, squeeze heels toward glutes."
          },
          {
            id: "ex-16",
            name: "Standing Calf Raises (Smith Machine or Step)",
            targetMuscle: "Calves (Gastrocnemius)",
            sets: 4,
            reps: "15-20 reps",
            restSeconds: 45,
            formTips: "Full deep stretch at bottom, 2 second hold on tiptoes."
          },
          {
            id: "ex-17",
            name: "Hanging Leg / Knee Raises & Plank",
            targetMuscle: "Abs & Core Stability",
            sets: 3,
            reps: "15 reps / 45s plank",
            restSeconds: 45,
            formTips: "Posterior pelvic tilt, avoid swinging."
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        focus: "Active Recovery & Mobility Day",
        isRestDay: true,
        warmup: ["Light 15-min walk", "Thoracic Spine Mobility", "Hip Openers"],
        cooldown: ["Full body stretching routine"],
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        focus: "Upper Body Hypertrophy",
        isRestDay: false,
        warmup: ["Arm rotations", "Band pull-aparts", "Light pushups"],
        cooldown: ["Shoulder & Lat stretches"],
        exercises: [
          {
            id: "ex-18",
            name: "Barbell / Dumbbell Flat Bench Press",
            targetMuscle: "Chest & Front Delts",
            sets: 4,
            reps: "8-10 reps",
            restSeconds: 90,
            formTips: "Plant feet firmly, moderate arch, drive bar explosively."
          },
          {
            id: "ex-19",
            name: "Neutral Grip Lat Pulldown or Pull-ups",
            targetMuscle: "Lats & Mid-Back",
            sets: 4,
            reps: "8-12 reps",
            restSeconds: 75,
            formTips: "Pull elbows down into pockets."
          },
          {
            id: "ex-20",
            name: "Dumbbell Standing Arnold Press",
            targetMuscle: "All 3 Shoulder Heads",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 75,
            formTips: "Rotate palms from facing chest outwards as you press overhead smoothly."
          },
          {
            id: "ex-21",
            name: "Cable Chest Flyes (Low to High)",
            targetMuscle: "Upper & Inner Chest Line",
            sets: 3,
            reps: "12-15 reps",
            restSeconds: 60,
            formTips: "Cross hands slightly at peak for maximum chest squeeze."
          },
          {
            id: "ex-22",
            name: "EZ Bar Preacher Curls",
            targetMuscle: "Biceps Short Head",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 60,
            formTips: "Arms locked in place on pad, isolate bicep without shoulder help."
          },
          {
            id: "ex-23",
            name: "Overhead Dumbbell Tricep Extension",
            targetMuscle: "Triceps Long Head (Big Arm Mass)",
            sets: 3,
            reps: "10-12 reps",
            restSeconds: 60,
            formTips: "Keep upper arms vertical, deep stretch behind neck."
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        focus: "Lower Body & Arms / Weak Points",
        isRestDay: false,
        warmup: ["Dynamic leg swings", "Glute bridges"],
        cooldown: ["Hamstring & Hip flexor stretches"],
        exercises: [
          {
            id: "ex-24",
            name: "Goblet Squats (with Dumbbell)",
            targetMuscle: "Quads & Core",
            sets: 4,
            reps: "12 reps",
            restSeconds: 75,
            formTips: "Hold dumbbell close to chest. Upright torso takes stress off lower back.",
            safetyNote: "Safest squat variation for lumbar comfort."
          },
          {
            id: "ex-25",
            name: "Walking Dumbbell Lunges",
            targetMuscle: "Quads, Glutes & Hamstrings",
            sets: 3,
            reps: "12 steps per leg",
            restSeconds: 75,
            formTips: "90-degree knee bend on each stride."
          },
          {
            id: "ex-26",
            name: "Seated Cable / Dumbbell Lateral Raises",
            targetMuscle: "Side Delts",
            sets: 4,
            reps: "15 reps",
            restSeconds: 45,
            formTips: "Seated position prevents body momentum cheating."
          },
          {
            id: "ex-27",
            name: "Cable Bicep Curls (Straight Bar)",
            targetMuscle: "Biceps",
            sets: 3,
            reps: "12-15 reps",
            restSeconds: 60,
            formTips: "Constant tension throughout whole range."
          }
        ]
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        focus: "Complete Rest & Weekly Review Day",
        isRestDay: true,
        warmup: ["Relaxed walking or foam rolling"],
        cooldown: ["Light deep breathing"],
        exercises: []
      }
    ]
  },
  dietChart: {
    dietType: "High Protein Vegetarian Muscle Building Diet (140g Protein)",
    meals: [
      {
        mealName: "1. Morning Nashta / Breakfast (8:00 AM)",
        timing: "8:00 AM",
        mealProtein: 30,
        mealCalories: 580,
        notes: "Rich in complex carbs, dietary fiber, and healthy fats for morning energy.",
        items: [
          {
            food: "70g Rolled Oats cooked in 250ml Milk",
            protein: 14,
            calories: 360,
            alternative: "Poha with 50g roasted peanuts or Besan Chilla with paneer stuffing"
          },
          {
            food: "1 Banana + 1 tbsp Peanut Butter (20g) + 5 Almonds",
            protein: 7,
            calories: 180,
            alternative: "1 Apple + 1 tbsp Chia/Flax seeds"
          },
          {
            food: "1 scoop Whey Protein in water (or 100g Greek yogurt)",
            protein: 24,
            calories: 120,
            alternative: "250ml Soy milk or 80g Paneer cubes"
          }
        ]
      },
      {
        mealName: "2. Mid-Morning Snack (11:30 AM)",
        timing: "11:30 AM",
        mealProtein: 22,
        mealCalories: 340,
        notes: "Quick protein snack to maintain constant amino acid levels.",
        items: [
          {
            food: "100g Fresh Low Fat Paneer (Raw with chaat masala or pan tossed)",
            protein: 18,
            calories: 220,
            alternative: "100g Tofu or 1 cup Boiled Sprouted Moong"
          },
          {
            food: "1 Whole Fruit (Seasonal Orange / Guava / Apple)",
            protein: 2,
            calories: 80,
            alternative: "Cucumber & Tomato bowl with lemon"
          }
        ]
      },
      {
        mealName: "3. Dopahar ka Khana / Lunch (1:30 PM)",
        timing: "1:30 PM",
        mealProtein: 36,
        mealCalories: 680,
        notes: "Heavy balanced meal fueling afternoon glycogen and muscle recovery.",
        items: [
          {
            food: "45g Soya Chunks (boiled & cooked with light masala/veggies)",
            protein: 24,
            calories: 150,
            alternative: "150g Paneer Bhurji or 1.5 cup Rajma / Chhole"
          },
          {
            food: "2 Whole Wheat Rotis (Multigrain/Atta) + 1 small bowl Rice (100g)",
            protein: 8,
            calories: 280,
            alternative: "3 Phulkas without butter"
          },
          {
            food: "1 large bowl Dal (Moong/Arhar) + 1 bowl Green Veggies (Bhindi/Gobi)",
            protein: 8,
            calories: 160,
            alternative: "Palak Paneer or Mixed veg curry"
          },
          {
            food: "1 bowl Curd/Dahi (150g) + Fresh Salad",
            protein: 6,
            calories: 90,
            alternative: "Buttermilk (Chaas) with roasted jeera"
          }
        ]
      },
      {
        mealName: "4. Pre-Workout Snack (5:00 PM - 45 mins before gym)",
        timing: "5:00 PM",
        mealProtein: 8,
        mealCalories: 260,
        notes: "Fast-acting carbs for intense gym pump and muscle endurance.",
        items: [
          {
            food: "2 Brown Bread slices with 1.5 tbsp Peanut butter",
            protein: 9,
            calories: 240,
            alternative: "2 Boiled Potatoes with salt & pepper or 1 cup Dalia"
          },
          {
            food: "1 cup Black Coffee / Green Tea (Sugar free)",
            protein: 0,
            calories: 5,
            alternative: "Pre-workout scoop or warm water with lemon"
          }
        ]
      },
      {
        mealName: "5. Post-Workout Shake (7:30 PM - Immediately after gym)",
        timing: "7:30 PM",
        mealProtein: 26,
        mealCalories: 180,
        notes: "Rapid protein absorption to jumpstart muscle protein synthesis.",
        items: [
          {
            food: "1 Scoop Whey Protein (in 250ml cold water) + 3g Creatine Monohydrate",
            protein: 24,
            calories: 120,
            alternative: "Homemade Sattu Drink (40g Sattu + 200ml Curd + Chaat masala)"
          },
          {
            food: "1 Banana or 2 Medjool Dates",
            protein: 1,
            calories: 90,
            alternative: "1 cup coconut water"
          }
        ]
      },
      {
        mealName: "6. Raat ka Khana / Dinner (9:00 PM)",
        timing: "9:00 PM",
        mealProtein: 30,
        mealCalories: 550,
        notes: "Clean night meal promoting overnight muscle recovery without heavy fat storage.",
        items: [
          {
            food: "80g Paneer + Mixed Bell Peppers & Broccoli Stir-Fry",
            protein: 16,
            calories: 220,
            alternative: "100g Tofu & Mushroom stir-fry"
          },
          {
            food: "1.5 cup Boiled Chana / Rajma / Mixed Dal",
            protein: 12,
            calories: 210,
            alternative: "1 bowl Black Chana Chaat"
          },
          {
            food: "1 Multi-grain Roti or 1 small bowl Brown/White Rice",
            protein: 4,
            calories: 120,
            alternative: "Quinoa bowl or 2 Jowar rotis"
          }
        ]
      }
    ],
    supplementsGuidance: [
      {
        name: "Creatine Monohydrate",
        purpose: "Increases muscle ATP power, strength in heavy sets, and muscle fullness.",
        dosageTiming: "3-5g daily at any fixed time (e.g. Post-workout with water/carb). No loading phase strictly needed.",
        isOptional: false
      },
      {
        name: "Whey Protein Concentrate / Isolate",
        purpose: "High bioavailable protein to meet daily 140g target conveniently.",
        dosageTiming: "1 scoop (24-27g protein) post-workout or in breakfast oats.",
        isOptional: false
      },
      {
        name: "Omega-3 (Fish Oil or Algal/Flaxseed Oil)",
        purpose: "Joint lubrication, reduces inflammation, and aids heart health.",
        dosageTiming: "1 capsule daily with dinner or breakfast.",
        isOptional: true
      },
      {
        name: "Vitamin D3 + K2 & Multivitamin",
        purpose: "Optimal testosterone synthesis, bone density, and immune defense.",
        dosageTiming: "1 tablet with a fat-containing meal (Breakfast/Lunch).",
        isOptional: true
      }
    ],
    generalTips: [
      "Water Intake: Kam se kam 3.5 to 4 Liters paani roz peeyein.",
      "Sleep: 7-8 ghante ki uninterrupted neend muscle recovery aur growth hormone release ke liye mandatory hai.",
      "Progressive Overload: Har hafte weights ya reps mein thoda izafa (increase) karne ki koshish karein.",
      "Rest days are when muscles actually grow! Eat your full protein target on rest days too."
    ]
  }
};
