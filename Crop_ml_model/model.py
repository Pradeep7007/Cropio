import pandas as pd
import ydata_profiling as pp
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import warnings
import os
import plotly.graph_objects as go
import plotly.io as pio
import pickle
import logging

from sklearn.utils import resample
# Metrics
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, auc, roc_curve

# Validation
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.pipeline import Pipeline, make_pipeline

# Tuning
from sklearn.model_selection import GridSearchCV

# Feature Extraction
from sklearn.feature_selection import RFE

# Preprocessing
from sklearn.preprocessing import MinMaxScaler, StandardScaler, Normalizer, Binarizer, LabelEncoder

# Models
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
# Ensembles
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.ensemble import ExtraTreesClassifier

warnings.filterwarnings('ignore')

sns.set_style("whitegrid", {'axes.grid': False})
pio.templates.default = "plotly_white"

# ---------------------------------------------------------------------------- #
#                                Logging Setup                                 #
# ---------------------------------------------------------------------------- #
logging.basicConfig(
    filename="training.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger()


################################################################################
#                            Analyze Data                                      #
################################################################################
def explore_data(df):
    logger.info(f"Dataset Shape: {df.shape}")
    logger.info(f"Dataset Columns: {list(df.columns)}")
    logger.info("Data Types:\n%s", df.dtypes)


################################################################################
#                      Checking for Duplicates                                 #
################################################################################
def checking_removing_duplicates(df):
    count_dups = df.duplicated().sum()
    logger.info("Number of Duplicates: %d", count_dups)
    if count_dups >= 1:
        df.drop_duplicates(inplace=True)
        logger.info("Duplicate values removed")
    else:
        logger.info("No duplicate values found")


################################################################################
#                Split Data to Training and Validation set                     #
################################################################################
def read_in_and_split_data(data, target):
    X = data.drop(target, axis=1)
    y = data[target]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0
    )
    logger.info("Data split into train (%d) and test (%d)", len(X_train), len(X_test))
    return X_train, X_test, y_train, y_test


################################################################################
#                           Train Model                                        #
################################################################################
def fit_model(X_train, y_train, models):
    num_folds = 10
    scoring = 'accuracy'
    results = []
    names = []
    for name, model in models:
        kfold = KFold(n_splits=num_folds, shuffle=True, random_state=0)
        cv_results = cross_val_score(model, X_train, y_train, cv=kfold, scoring=scoring)
        results.append(cv_results)
        names.append(name)
        logger.info("%s: %f (%f)", name, cv_results.mean(), cv_results.std())
    return names, results


################################################################################
#                          Save Trained Model                                  #
################################################################################
def save_model(model, filename):
    pickle.dump(model, open(filename, 'wb'))
    logger.info("Model saved as %s", filename)


################################################################################
#                          Performance Measure                                 #
################################################################################
def classification_metrics(model, conf_matrix, X_train, y_train, X_test, y_test, y_pred):
    train_acc = model.score(X_train, y_train) * 100
    val_acc = model.score(X_test, y_test) * 100
    logger.info("Training Accuracy: %.2f%%", train_acc)
    logger.info("Validation Accuracy: %.2f%%", val_acc)

    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(pd.DataFrame(conf_matrix), annot=True, cmap='YlGnBu', fmt='g')
    ax.xaxis.set_label_position('top')
    plt.tight_layout()
    plt.title('Confusion Matrix', fontsize=20, y=1.1)
    plt.ylabel('Actual label', fontsize=15)
    plt.xlabel('Predicted label', fontsize=15)
    plt.show()

    logger.info("Classification Report:\n%s", classification_report(y_test, y_pred))


# ---------------------------------------------------------------------------- #
#                                  Main Script                                 #
# ---------------------------------------------------------------------------- #
try:
    # Load Dataset
    df = pd.read_csv('Crop_recommendation.csv')
    logger.info("Dataset loaded successfully with %d rows", len(df))

    # Remove Outliers
    numeric_df = df.select_dtypes(include=[np.number])
    Q1 = numeric_df.quantile(0.25)
    Q3 = numeric_df.quantile(0.75)
    IQR = Q3 - Q1
    df_out = df[~((numeric_df < (Q1 - 1.5 * IQR)) |
                  (numeric_df > (Q3 + 1.5 * IQR))).any(axis=1)]
    logger.info("Outliers removed. Rows before: %d, after: %d", len(df), len(df_out))

    # Split Data
    target = 'label'
    X_train, X_test, y_train, y_test = read_in_and_split_data(df_out, target)

    # Train Model
    pipeline = make_pipeline(StandardScaler(), GaussianNB())
    model = pipeline.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    conf_matrix = confusion_matrix(y_test, y_pred)

    # Evaluate
    classification_metrics(pipeline, conf_matrix, X_train, y_train, X_test, y_test, y_pred)

    # Save Model
    save_model(model, 'model.pkl')

    logger.info("Pipeline execution completed successfully")

except Exception as e:
    logger.error("Error occurred: %s", str(e), exc_info=True)
