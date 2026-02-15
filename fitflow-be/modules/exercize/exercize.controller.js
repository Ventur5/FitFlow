const exercises = require("./exercises.json");

const calculateBMI = (weight, height) => {
  return weight / ((height / 100) ** 2);
};

const getRecommendations = (req, res) => {
  try {
    const { weight, height } = req.query;

    if (!weight || !height) {
      return res.status(400).json({ message: "Inserisci peso e altezza" });
    }

    const bmi = calculateBMI(Number(weight), Number(height));
    let category;

    if (bmi < 18.5) category = "underweight";
    else if (bmi >= 18.5 && bmi <= 24.9) category = "normal";
    else category = "overweight";

    const { exercises: recommendedExercises, nutrition: recommendedNutrition } = exercises[category];

    res.json({
      bmi,
      category,
      exercises: recommendedExercises,
      nutrition: recommendedNutrition
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecommendations };
