-- ============================================================
-- Seed: AI/ML Learning Modules & Quiz Questions
-- Module 1: Decision Trees | Module 2: Linear Regression
-- ============================================================

USE aiml_learning_db;

-- ─── Modules ─────────────────────────────────────────────────
INSERT INTO modules (id, title, description, content_json, order_index) VALUES
(1,
 'Decision Trees',
 'Learn how Decision Trees work — a fundamental supervised learning algorithm used for classification and prediction.',
 '{
   "concept": "A Decision Tree is a tree-shaped model that makes decisions by splitting data based on feature values. Each internal node tests a feature, each branch represents an outcome, and each leaf node gives a prediction.",
   "realWorldExample": "A bank uses a decision tree to decide whether to approve a loan: it checks income → then credit score → then employment status, ultimately approving or rejecting.",
   "keyTerms": [
     {"term": "Root Node", "definition": "The topmost node — represents the best feature to split on first."},
     {"term": "Splitting", "definition": "Dividing data into subsets based on a feature condition (e.g., age > 30)."},
     {"term": "Leaf Node", "definition": "A terminal node — holds the final prediction or class label."},
     {"term": "Gini Impurity", "definition": "A measure of how often a randomly chosen element would be misclassified."},
     {"term": "Information Gain", "definition": "How much a split reduces uncertainty (entropy) in the data."},
     {"term": "Pruning", "definition": "Removing branches that add little predictive power to prevent overfitting."}
   ],
   "howItWorks": [
     "Start with all data at the root node.",
     "Choose the best feature to split on (highest information gain / lowest Gini).",
     "Split data into child nodes based on that feature.",
     "Repeat for each child node recursively.",
     "Stop when data is pure, max depth is reached, or no improvement is possible.",
     "Assign the majority class at each leaf."
   ],
   "advantages": ["Easy to interpret and visualize", "No feature scaling needed", "Handles both numeric and categorical data"],
   "disadvantages": ["Prone to overfitting with deep trees", "Sensitive to noisy data", "Can be biased toward features with more levels"],
   "simulationType": "decision_tree"
 }',
 1),

(2,
 'Linear Regression',
 'Understand Linear Regression — the go-to algorithm for predicting continuous values by finding the best-fit line through data.',
 '{
   "concept": "Linear Regression models the relationship between an input (X) and a continuous output (Y) as a straight line: Y = mX + b. The model learns the slope (m) and intercept (b) that best fits the training data.",
   "realWorldExample": "Predicting house prices: the model learns that for every extra 100 sq ft, price increases by $15,000. Given a new house size, it predicts its price.",
   "keyTerms": [
     {"term": "Slope (m)", "definition": "How much Y changes for a unit increase in X."},
     {"term": "Intercept (b)", "definition": "The value of Y when X = 0."},
     {"term": "Residual", "definition": "The difference between the actual Y and the predicted Y."},
     {"term": "MSE", "definition": "Mean Squared Error — average of squared residuals. Lower is better."},
     {"term": "R² Score", "definition": "How well the model explains variance in data. 1.0 = perfect fit."},
     {"term": "Gradient Descent", "definition": "An optimization algorithm that iteratively adjusts m and b to minimize MSE."}
   ],
   "howItWorks": [
     "Collect labelled (X, Y) data points.",
     "Initialize slope (m) and intercept (b) to random values.",
     "Compute predictions: Ŷ = mX + b.",
     "Calculate error (loss) using MSE.",
     "Use Gradient Descent to update m and b to reduce error.",
     "Repeat until error is minimized (model converges)."
   ],
   "advantages": ["Simple and interpretable", "Fast to train", "Works well when relationship is linear"],
   "disadvantages": ["Assumes linear relationship", "Sensitive to outliers", "Not suitable for complex patterns"],
   "simulationType": "linear_regression"
 }',
 2);

-- ─── Questions: Module 1 — Decision Trees ────────────────────
INSERT INTO questions (module_id, question_text, options_json, correct_answer, explanation) VALUES
(1,
 'What does the root node of a decision tree represent?',
 '["The final prediction", "The best feature to split on first", "A leaf with class label", "A random data point"]',
 'The best feature to split on first',
 'The root node is the starting point of the tree and represents the most informative feature — the one that best separates the data.'),

(1,
 'What is "pruning" in the context of decision trees?',
 '["Adding more branches to the tree", "Removing branches with little predictive value", "Selecting features for splitting", "Normalizing input data"]',
 'Removing branches with little predictive value',
 'Pruning removes overfitted branches that don\'t generalize well to new data, simplifying the model.'),

(1,
 'Which metric measures how often a randomly chosen element would be misclassified?',
 '["Information Gain", "Entropy", "Gini Impurity", "R² Score"]',
 'Gini Impurity',
 'Gini Impurity measures the probability of incorrect classification. A Gini of 0 means the node is pure (all one class).'),

(1,
 'What is "Information Gain" used for in decision trees?',
 '["Measuring model accuracy on test data", "Determining how much a split reduces entropy", "Calculating the number of leaf nodes", "Setting the maximum tree depth"]',
 'Determining how much a split reduces entropy',
 'Information Gain tells us how much a particular split reduces uncertainty in the dataset — higher gain = better split.'),

(1,
 'Which of the following is a disadvantage of decision trees?',
 '["They require feature scaling", "They cannot handle categorical data", "They are prone to overfitting with deep trees", "They only work with binary outcomes"]',
 'They are prone to overfitting with deep trees',
 'Deep decision trees memorize training data but may perform poorly on unseen data. Pruning and max_depth limits help prevent this.');

-- ─── Questions: Module 2 — Linear Regression ─────────────────
INSERT INTO questions (module_id, question_text, options_json, correct_answer, explanation) VALUES
(2,
 'In the equation Y = mX + b, what does "b" represent?',
 '["The slope of the line", "The prediction error", "The y-intercept when X is 0", "The learning rate"]',
 'The y-intercept when X is 0',
 'The intercept "b" is the value of Y when X equals 0. It shifts the regression line up or down on the Y-axis.'),

(2,
 'What does Mean Squared Error (MSE) measure in linear regression?',
 '["The slope of the regression line", "The average of squared differences between actual and predicted values", "The correlation between variables", "The number of training samples"]',
 'The average of squared differences between actual and predicted values',
 'MSE penalizes large errors by squaring them. A lower MSE means predictions are closer to actual values.'),

(2,
 'What is Gradient Descent used for in Linear Regression?',
 '["Visualizing the data distribution", "Iteratively minimizing the loss by updating slope and intercept", "Splitting data into train and test sets", "Removing outliers from the dataset"]',
 'Iteratively minimizing the loss by updating slope and intercept',
 'Gradient Descent adjusts m and b step by step in the direction that reduces MSE the most, until convergence.'),

(2,
 'An R² score of 1.0 means:',
 '["The model has no predictive power", "The model perfectly explains the variance in the data", "The model is overfitting", "There are no residuals in the model"]',
 'The model perfectly explains the variance in the data',
 'R² (coefficient of determination) ranges from 0 to 1. A score of 1.0 means the model accounts for all variability in Y.'),

(2,
 'Which of the following is a key assumption of linear regression?',
 '["Features must be categorical", "The relationship between X and Y is linear", "Data must be normally distributed in X", "Outliers are ignored automatically"]',
 'The relationship between X and Y is linear',
 'Linear regression assumes a straight-line relationship between the input(s) and output. If the true relationship is curved, the model will underfit.');

SELECT 'Seed completed: 2 modules, 10 questions inserted!' AS status;
