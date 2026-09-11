Pasted markdown(2).md
File
give me readme.md format

Absolutely. You want the entire README.md as one single copyable Markdown block, including everything from Objectives onward, with no separate boxes.

I can format the complete professional README based on your uploaded RetinaCare AI content.

# RetinaCare AI

## Explainable AI-Assisted Diabetic Retinopathy Screening for Rural Healthcare

> An offline-first, explainable AI-assisted diabetic retinopathy screening platform designed to support retinal screening workflows in resource-constrained and rural healthcare environments.

---

## Overview

Diabetic Retinopathy (DR) is a major complication of diabetes and can lead to preventable vision loss when not detected and managed at an early stage.

RetinaCare AI is designed as an end-to-end AI-assisted screening platform that combines retinal image quality assessment, diabetic retinopathy grading, explainable AI, doctor validation, referral management, reporting, and offline-first data handling into a single workflow.

The platform is designed to assist healthcare workers and doctors by providing an accessible screening workflow that can operate in environments with limited specialist availability and unreliable internet connectivity.

> **Disclaimer:** RetinaCare AI is a clinical decision-support research prototype and is not intended to replace qualified medical professionals.

---

# Problem Statement

Rural and underserved communities can face several challenges in accessing diabetic retinopathy screening:

- Limited availability of ophthalmologists
- Long travel distances to specialist healthcare centers
- Unreliable or unavailable internet connectivity
- Variable quality of images captured using portable fundus cameras
- Large screening populations
- Limited ability to interpret black-box AI predictions
- Lack of structured digital referral and follow-up workflows

A practical AI-assisted screening solution therefore needs to address more than image classification.

RetinaCare AI approaches the problem as a complete screening workflow:

```text
Patient Registration
        ↓
Fundus Image Capture / Upload
        ↓
Image Quality Assessment
        ↓
Quality Gate
    ↓          ↓
  Poor       Suitable
  Image       Image
    ↓           ↓
Recapture    AI Screening
                ↓
        DR Grading + Analysis
                ↓
         Explainable AI
                ↓
         Risk Assessment
                ↓
         Doctor Validation
                ↓
         Referral Decision
                ↓
           PDF Report
                ↓
         Follow-up Management
                ↓
        Offline Synchronization
Objectives

RetinaCare AI focuses on the following objectives.

1. Image Quality Assessment

Evaluate fundus images before AI analysis using:

Image resolution
Brightness
Contrast
Sharpness
Retinal field coverage

Images that are unsuitable for reliable screening can be rejected and sent for recapture.

2. Diabetic Retinopathy Grading

Classify retinal images according to five diabetic retinopathy severity levels:

Grade	Severity
0	No DR
1	Mild DR
2	Moderate DR
3	Severe DR
4	Proliferative DR
3. Explainable AI

Provide visual evidence supporting AI predictions using:

Grad-CAM
Lesion localization
Lesion segmentation
Prediction confidence
4. Human-in-the-Loop Validation

The AI system provides screening assistance while the doctor remains responsible for the final clinical decision.

Doctors can:

Review AI predictions
Inspect visual evidence
Validate predictions
Override predictions
Confirm referral requirements
5. Offline-First Screening

Support screening workflows in areas with unreliable connectivity through:

Local data storage
Local processing
Offline screening
Synchronization when connectivity returns
System Architecture
                          PATIENT
                             │
                             ▼
                    ┌──────────────────┐
                    │ Patient          │
                    │ Registration     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Fundus Image     │
                    │ Capture / Upload │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Image Quality    │
                    │ Assessment       │
                    └────────┬─────────┘
                             │
                       ┌─────┴─────┐
                       │           │
                    Poor Image   Suitable Image
                       │           │
                       ▼           ▼
                   Recapture    AI Pipeline
                                    │
                      ┌─────────────┼─────────────┐
                      │             │             │
                      ▼             ▼             ▼
                 DR Grading    Segmentation  Explainability
                 EfficientNet     U-Net*        Grad-CAM*
                      │             │             │
                      └─────────────┼─────────────┘
                                    │
                                    ▼
                             Risk Assessment
                                    │
                                    ▼
                             Doctor Validation
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                      Follow-up             Referral
                         │                     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                               PDF Report
                                    │
                                    ▼
                           Offline Synchronization
                                    │
                                    ▼
                           Cloud Infrastructure

* Experimental components currently under development and integration.

End-to-End Workflow
1. Patient Registration
        ↓
2. Fundus Image Upload
        ↓
3. Image Quality Assessment
        ↓
4. Quality Gate
        ↓
5. AI-Based DR Grading
        ↓
6. Lesion Analysis
        ↓
7. Explainable AI
        ↓
8. Risk Assessment
        ↓
9. Doctor Review
        ↓
10. Referral Decision
        ↓
11. PDF Report
        ↓
12. Patient Follow-up
        ↓
13. Cloud Synchronization
Technology Stack
Frontend
Technology	Purpose
Next.js	Web application framework
React	User interface
TypeScript	Type-safe development
Tailwind CSS	UI styling
Backend
Technology	Purpose
Python	Backend and AI development
FastAPI	REST API framework
SQLAlchemy	Database ORM
Pydantic	Data validation
JWT	Authentication
ReportLab	PDF report generation
AI and Computer Vision
Technology	Purpose
PyTorch	Deep learning framework
Torchvision	Computer vision models and transformations
EfficientNet-B0	Diabetic retinopathy grading
U-Net	Retinal lesion segmentation research
OpenCV	Image processing and quality assessment
Grad-CAM	Explainable AI
Database and Storage
Technology	Purpose
SQLite	Local/offline database
PostgreSQL	Cloud database
Local Storage	Images and reports
Cloud Storage	Synchronization and scalable storage
AI Pipeline
Stage 1 — Image Quality Assessment

The system evaluates the quality of an uploaded fundus image before performing disease classification.

The current quality assessment considers:

Resolution
    +
Brightness
    +
Contrast
    +
Sharpness
    +
Retinal Field Coverage
    ↓
Quality Score
    ↓
Good / Borderline / Poor

Poor-quality images are not passed to the grading model.

This quality gate reduces the risk of generating a prediction from an unsuitable input image.

Stage 2 — DR Grading

RetinaCare AI currently uses an EfficientNet-B0 based five-class classification model.

The model predicts:

Grade 0 → No DR
Grade 1 → Mild DR
Grade 2 → Moderate DR
Grade 3 → Severe DR
Grade 4 → Proliferative DR

The grading model is trained using the IDRiD Disease Grading dataset with ImageNet-pretrained EfficientNet-B0 weights.

The official IDRiD testing set is kept separate from the training and validation process.

Stage 3 — Retinal Lesion Segmentation

A U-Net based segmentation pipeline is being developed to identify retinal structures and lesions.

Target classes include:

Microaneurysms
Haemorrhages
Hard Exudates
Soft Exudates
Optic Disc

The segmentation component is currently experimental and requires additional optimization before it can be considered clinically reliable.

Stage 4 — Explainable AI

The planned explainability layer combines model predictions with visual evidence.

AI Prediction
      +
Grad-CAM
      +
Lesion Evidence
      +
Confidence
      ↓
Visual Explanation

The purpose is to provide doctors with interpretable evidence that can support review of the AI-assisted screening result.

Doctor Validation

RetinaCare AI follows a human-in-the-loop approach.

AI Prediction
      ↓
Visual Evidence
      ↓
Doctor Review
      ↓
Accept / Override
      ↓
Final Clinical Decision

The AI prediction is not treated as the final diagnosis.

A qualified healthcare professional must review and validate the result before clinical action.

Dataset

RetinaCare AI uses publicly available retinal datasets for research and model development.

IDRiD

The Indian Diabetic Retinopathy Image Dataset (IDRiD) is used for:

Diabetic retinopathy grading
Retinal lesion segmentation
Optic disc segmentation
Model evaluation

The disease grading dataset contains five diabetic retinopathy severity levels.

The segmentation dataset provides pixel-level annotations for multiple retinal lesions and the optic disc.

Additional datasets identified for future benchmarking include:

APTOS 2019
Messidor-2
DRIVE

Dataset licenses and usage conditions remain applicable to their respective datasets.

Current Model Evaluation

The project intentionally reports experimental model results rather than presenting unvalidated performance as clinical accuracy.

EfficientNet-B0 Initial Baseline

The initial EfficientNet-B0 model was evaluated on the untouched IDRiD official test set.

Metric	Result
Test Accuracy	56.31%
Macro F1	44.59%
Weighted F1	56.02%
Per-Class Performance
DR Grade	Precision	Recall	F1
No DR	0.64	0.68	0.66
Mild DR	0.00	0.00	0.00
Moderate DR	0.57	0.62	0.60
Severe DR	0.61	0.58	0.59
Proliferative DR	0.50	0.31	0.38

These results represent an initial research baseline.

They are not sufficient to claim clinical deployment readiness.

The model requires further optimization, particularly for minority classes such as Mild and Proliferative DR.

Segmentation Experiment

An initial U-Net segmentation experiment was performed using the IDRiD segmentation dataset.

Best Validation Mean Dice = 0.2587
Best Epoch = 11

The initial test evaluation showed stronger segmentation performance for hard exudates than several other target classes.

Current segmentation results are therefore treated as an experimental baseline.

Future optimization areas include:

Class imbalance handling
Improved augmentation
Pretrained encoders
Focal/Tversky-based loss functions
Patch-based training
Lesion-specific optimization
Improved generalization across datasets
Application Features
Patient Management
Patient registration
Patient information management
Screening history
Follow-up information
Fundus Screening
Fundus image upload
Image quality assessment
Quality-based recapture guidance
AI-assisted DR grading
Screening result visualization
Doctor Workflow
Doctor review interface
AI result inspection
Visual evidence review
AI result validation
Prediction override
Referral confirmation
Reporting
Automated screening reports
AI assessment summary
Screening information
Doctor validation
Referral information
PDF report generation
Offline Support
Local data storage
Local screening workflow
Offline-first architecture
Synchronization-ready design
Cloud database support
User Roles
Health Worker

Health workers can:

Register patients
Upload fundus images
Perform screening workflows
Review image quality feedback
Manage patient screening information
Initiate referrals
Doctor

Doctors can:

Review AI predictions
Inspect visual evidence
Validate AI results
Override predictions
Confirm referrals
Review patient screening history
Admin

Administrators can manage:

Users
Healthcare facilities
System-level records
Audit information
Platform configuration
Project Structure
RetinaCare-AI/
│
├── ai-models/
│   └── grading/
│       └── efficientnet/
│           └── best_efficientnet_b0.pth
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── explainability/
│   │   │   │   ├── gradcam.py
│   │   │   │   └── visualization.py
│   │   │   │
│   │   │   ├── grading/
│   │   │   │   ├── inference.py
│   │   │   │   └── model.py
│   │   │   │
│   │   │   ├── localization/
│   │   │   ├── preprocessing/
│   │   │   │   ├── image_preprocessing.py
│   │   │   │   └── quality_assessment.py
│   │   │   │
│   │   │   ├── risk/
│   │   │   └── segmentation/
│   │   │
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── storage/
│   │   └── utils/
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── datasets/
│   └── IDRiD/
│
├── training/
│   └── grading/
│
├── docker-compose.yml
├── .gitignore
└── README.md
Local Development
Prerequisites

Install:

Python 3.11+
Node.js 18+
npm
Git

Optional:

NVIDIA GPU with a compatible CUDA environment for accelerated model training and inference
Clone Repository
git clone https://github.com/Vikasnayakar/RetinaCare-AI.git
cd RetinaCare-AI
Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv .venv

Activate the virtual environment on Windows:

.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Start the FastAPI server:

uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

Health endpoint:

http://127.0.0.1:8000/health
Frontend Setup

Open another terminal.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend:

http://localhost:3000
Environment Variables

Create the required environment files using the project's .env.example configuration.

Typical backend configuration:

DATABASE_URL=sqlite:///./sih26038.db
SECRET_KEY=CHANGE_THIS_SECRET_KEY
FRONTEND_URL=http://localhost:3000

For production:

Use a strong secret key
Store secrets using environment variables
Never commit .env files
Configure production database credentials
Configure the production frontend URL
Use HTTPS
API Architecture

The backend is organized into modular FastAPI API domains:

/auth
/users
/patients
/screenings
/ai
/doctor-reviews
/referrals
/followups
/reports
/phcs
/sync
/analytics
/audit

The architecture separates:

Authentication
Patient management
Screening
AI processing
Doctor validation
Referral management
Follow-up
Reporting
Synchronization
Analytics
Audit logging
Security and Privacy

Because retinal images and patient information may represent sensitive healthcare information, RetinaCare AI incorporates security-oriented design principles.

Current considerations include:

Authentication
Role-based access control
Password hashing
JWT-based authorization
Controlled API access
Audit logging
Environment-based secret management
Separation of datasets and source code
Offline-first data handling

A real-world clinical deployment would additionally require:

Data encryption
Infrastructure security
Regulatory compliance
Clinical validation
Access governance
Data retention policies
Security testing
Privacy controls
Formal audit procedures
Offline-First Architecture

One of the core design goals of RetinaCare AI is to support healthcare environments with unreliable connectivity.

                  Rural Healthcare Facility
                           │
                           ▼
                  ┌──────────────────┐
                  │ RetinaCare AI    │
                  │ Local Application│
                  └────────┬─────────┘
                           │
                ┌──────────┴───────────┐
                │                      │
                ▼                      ▼
         Local Patient Data        Local AI
                │                      │
                └──────────┬───────────┘
                           │
                       No Internet
                           │
                       Screening
                       Continues
                           │
                           ▼
                    Internet Returns
                           │
                           ▼
                  Synchronization Queue
                           │
                           ▼
                     Cloud Database

This approach reduces dependency on continuous internet connectivity for the core screening workflow.

Cloud Deployment Architecture

The intended deployment architecture is:

                          Internet
                             │
                             ▼
                      ┌──────────────┐
                      │    Vercel    │
                      │  Next.js UI  │
                      └──────┬───────┘
                             │
                            HTTPS
                             │
                             ▼
                      ┌──────────────┐
                      │    Render    │
                      │   FastAPI    │
                      └──────┬───────┘
                             │
                 ┌───────────┼───────────┐
                 │           │           │
                 ▼           ▼           ▼
            PostgreSQL    AI Model    Reports
                 │           │           │
                 └───────────┼───────────┘
                             │
                             ▼
                    Cloud Synchronization

The exact production storage architecture will depend on deployment requirements and security considerations.

Design Principles
Explainability

AI predictions should be accompanied by interpretable evidence wherever possible.

Human Oversight

The system assists healthcare professionals rather than replacing them.

Offline First

The screening workflow should remain useful in environments with limited connectivity.

Quality Before Prediction

Poor-quality retinal images should be detected before disease classification.

Modular Architecture

Frontend, backend, AI, storage, reporting, and synchronization components are designed as modular services.

Evidence-Based Development

Model performance is measured using established datasets and evaluation metrics rather than relying on fabricated or unsupported performance claims.

Current Development Status
Component	Status
Patient Registration	✅ Implemented
Patient Management	✅ Implemented
Fundus Image Upload	✅ Implemented
Image Quality Assessment	✅ Implemented
Quality Gate	✅ Implemented
DR Grading Pipeline	✅ Implemented
EfficientNet-B0 Model	🧪 Experimental
Doctor Review Workflow	✅ Implemented
PDF Report Generation	✅ Implemented
Local Storage	✅ Implemented
Offline-First Foundation	✅ Implemented
U-Net Segmentation	🧪 Experimental
Grad-CAM	🚧 Integration in Progress
Lesion-Level Explanation	🚧 In Progress
Advanced Risk Assessment	🚧 In Progress
Cloud Synchronization	🚧 In Progress
Production Deployment	🚧 In Progress
MATLAB / Simulink Workflow	🚧 Planned
Clinical Validation	🚧 Future Work
Roadmap
Phase 1 — Functional Prototype
Patient registration
Fundus image upload
Image quality assessment
Quality gate
AI grading pipeline
Doctor review
PDF reports
Local database
Phase 2 — AI Improvement
Improve DR grading performance
Address class imbalance
Improve Mild DR detection
Improve Proliferative DR detection
Improve referable DR sensitivity
Improve referable DR specificity
Improve segmentation performance
Integrate Grad-CAM
Improve lesion-level evidence
Phase 3 — Clinical Workflow
Enhanced referral prioritization
Follow-up scheduling
Longitudinal screening history
Doctor feedback loop
Clinical validation workflow
Phase 4 — Rural Deployment
Robust synchronization queue
Cloud database deployment
PHC-level deployment
Scalable infrastructure
Monitoring and audit infrastructure
Phase 5 — MATLAB / Simulink Alignment
Image acquisition simulation
Image processing throughput simulation
Network bandwidth modelling
Doctor review capacity modelling
Resource allocation simulation
District-scale screening workflow simulation
Research Direction

The long-term objective of RetinaCare AI is to move beyond a standalone disease classifier toward a complete explainable, human-in-the-loop screening system.

Image Quality
      ↓
Robust DR Grading
      ↓
Lesion-Level Evidence
      ↓
Explainability
      ↓
Calibrated Confidence
      ↓
Risk Assessment
      ↓
Doctor Validation
      ↓
Referral Prioritization
      ↓
Patient Follow-up
      ↓
Offline + Cloud Continuity

The research direction focuses on combining these components into a unified screening workflow suitable for resource-constrained healthcare environments.

Limitations

RetinaCare AI is currently an academic research and prototype system.

Important limitations include:

The current DR grading model is not clinically validated.
The initial grading model has limited performance on minority classes.
Mild DR detection requires significant improvement.
Proliferative DR recall requires further improvement.
Initial U-Net segmentation performance is inconsistent across lesion classes.
Explainability components are still under integration.
Clinical validation has not yet been completed.
The current system should not be used to make independent medical decisions.
Production deployment requires appropriate security, privacy, regulatory, and clinical validation processes.
Smart India Hackathon Alignment

Problem Statement: SIH26038

Title: Explainable AI for Diabetic Retinopathy Screening in Rural India

Theme: MedTech / BioTech / HealthTech

Organization: MathWorks

RetinaCare AI addresses the problem statement through:

Requirement	RetinaCare AI Approach
Image Quality Assessment	Automated quality scoring and recapture guidance
Image Enhancement	Preprocessing and normalization pipeline
DR Grading	EfficientNet-B0 five-class classification
Lesion Analysis	U-Net segmentation research pipeline
Explainability	Grad-CAM and lesion-level evidence
Confidence	Model confidence included with predictions
Doctor Validation	Human-in-the-loop review workflow
Rural Connectivity	Offline-first architecture
Reporting	Automated PDF reports
Follow-up	Referral and follow-up workflow
Scalability	Cloud-ready architecture
Simulation	MATLAB / Simulink workflow planned
Why RetinaCare AI?

The core innovation is not simply using deep learning to classify retinal images.

The project combines:

Image Quality Gating
        +
AI-Based DR Grading
        +
Lesion Analysis
        +
Explainable AI
        +
Doctor Validation
        +
Offline-First Architecture
        +
Referral Management
        +
Follow-up
        +
Cloud Synchronization

This creates a complete screening-oriented workflow rather than an isolated AI classifier.

References
Porwal, P. et al. (2018).
Indian Diabetic Retinopathy Image Dataset (IDRiD): A Database for Diabetic Retinopathy Screening Research.
Data, 3(3), 25.
https://doi.org/10.3390/data3030025
Porwal, P. et al. (2020).
Indian Diabetic Retinopathy Image Dataset (IDRiD): A Database for Diabetic Retinopathy Screening Research.
Medical Image Analysis, 59, 101561.
https://doi.org/10.1016/j.media.2019.101561
Gulshan, V. et al. (2016).
Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs.
JAMA, 316(22), 2402–2410.
https://doi.org/10.1001/jama.2016.17216
Gulshan, V. et al. (2019).
Performance of a Deep-Learning Algorithm vs Manual Grading for Detecting Diabetic Retinopathy in India.
JAMA Ophthalmology, 137(9), 987–993.
https://doi.org/10.1001/jamaophthalmol.2019.0556
Natarajan, S. et al. (2019).
Evaluation of an Artificial Intelligence–Based Screening Tool for Diabetic Retinopathy in a Primary Care Setting.
JAMA Ophthalmology.
https://doi.org/10.1001/jamaophthalmol.2019.1805
Rahaman, M. M. et al. (2026).
Explainable Artificial Intelligence for Diabetic Retinopathy Detection Using Vision Transformers.
Scientific Reports.
https://doi.org/10.1038/s41598-026-56569-4
Acknowledgement

This project is developed as part of the Smart India Hackathon (SIH) 2026 for problem statement SIH26038 — Explainable AI for Diabetic Retinopathy Screening in Rural India.

The project uses publicly available retinal datasets and open-source software frameworks for research and prototype development.

Disclaimer

RetinaCare AI is an academic research prototype and clinical decision-support system. It is not a medical device and must not be used as a substitute for examination, diagnosis, or treatment by a qualified healthcare professional.

The AI predictions presented by the current prototype are experimental and require appropriate clinical validation before any real-world medical deployment.

License

This repository is intended primarily for academic and research purposes.

Dataset licenses and third-party software licenses remain applicable to their respective components.

Users are responsible for complying with the licensing terms of all external datasets, libraries, pretrained models, and resources used with this project.

Project Information
Field	Details
Project	RetinaCare AI
Problem Statement	SIH26038
Domain	MedTech / BioTech / HealthTech
Focus	Explainable AI for Diabetic Retinopathy Screening
Target Environment	Rural and Resource-Constrained Healthcare
Frontend	Next.js + React + TypeScript
Backend	FastAPI + Python
AI	PyTorch + EfficientNet-B0 + U-Net
Computer Vision	OpenCV
Database	SQLite / PostgreSQL
Reporting	ReportLab
Deployment	Cloud-ready / Offline-first
Built for Smarter, Explainable and Accessible Retinal Screening
RetinaCare AI — Screen Early. Explain Clearly. Refer on Time.

This is based on the README content you provided, including the objectives, architecture, technology stack, experimental evaluation, development status, roadmap, SIH alignment, and disclaimer. :contentReference[oaicite:1]{index=1}
im not asking u to give me just text i want readme.md format ill paste directly everything

Yes bro — you mean you want the actual README.md file, not Markdown text displayed in the chat.

I’ll create a proper README.md file that you can download → put directly into your GitHub repository.

ok

Done bro. This is the actual README.md file, ready to put directly into your GitHub repository.

Download README.md

Just replace your existing README.md with this file and push:

git add README.md
git commit -m "docs: update professional README"
git push

README.md
Document

Library
/
README.md


# RetinaCare AI

## Explainable AI-Assisted Diabetic Retinopathy Screening for Rural Healthcare

> An offline-first, explainable AI-assisted diabetic retinopathy screening platform designed to support retinal screening workflows in resource-constrained and rural healthcare environments.

---

## Overview

Diabetic Retinopathy (DR) is a major complication of diabetes and can lead to preventable vision loss when not detected and managed at an early stage.

RetinaCare AI is designed as an end-to-end AI-assisted screening platform that combines retinal image quality assessment, diabetic retinopathy grading, explainable AI, doctor validation, referral management, reporting, and offline-first data handling into a single workflow.

The platform is designed to assist healthcare workers and doctors by providing an accessible screening workflow that can operate in environments with limited specialist availability and unreliable internet connectivity.

RetinaCare AI is a **clinical decision-support research prototype** and is not intended to replace qualified medical professionals.

---

# Problem Statement

Rural and underserved communities can face several challenges in accessing diabetic retinopathy screening:

- Limited availability of ophthalmologists
- Long travel distances to specialist healthcare centers
- Unreliable or unavailable internet connectivity
- Variable quality of images captured using portable fundus cameras
- Large screening populations
- Limited ability to interpret black-box AI predictions
- Lack of structured digital referral and follow-up workflows

A practical AI-assisted screening solution therefore needs to address more than image classification.

RetinaCare AI approaches the problem as a complete screening workflow:

```text
Patient Registration
        ↓
Fundus Image Capture / Upload
        ↓
Image Quality Assessment
        ↓
Quality Gate
   ↓          ↓
Poor        Suitable
Image        Image
 ↓             ↓
Recapture    AI Screening
                ↓
       DR Grading + Analysis
                ↓
        Explainable AI
                ↓
        Risk Assessment
                ↓
        Doctor Validation
                ↓
        Referral Decision
                ↓
          PDF Report
                ↓
        Follow-up Management
                ↓
       Offline Synchronization
Objectives

RetinaCare AI focuses on the following objectives.

1. Image Quality Assessment

Evaluate fundus images before AI analysis using factors such as:

Image resolution
Brightness
Contrast
Sharpness
Retinal field coverage

Images that are unsuitable for reliable screening can be rejected and sent for recapture.

2. Diabetic Retinopathy Grading

Classify retinal images according to five diabetic retinopathy severity levels:

GradeSeverity	

0	No DR
1	Mild DR
2	Moderate DR
3	Severe DR
4	Proliferative DR
3. Explainable AI

Provide visual evidence supporting AI predictions using techniques such as:

Grad-CAM
Lesion localization
Lesion segmentation
Prediction confidence
4. Human-in-the-Loop Validation

The AI system provides screening assistance while the doctor remains responsible for the final clinical decision.

Doctors can:

Review AI predictions
Inspect visual evidence
Validate predictions
Override predictions
Confirm referral requirements
5. Offline-First Screening

Support screening workflows in areas with unreliable connectivity through:

Local data storage
Local processing
Offline screening
Synchronization when connectivity returns
System Architecture


                         PATIENT
                            │
                            ▼
                  ┌──────────────────┐
                  │ Patient          │
                  │ Registration     │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Fundus Image     │
                  │ Capture / Upload │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Image Quality    │
                  │ Assessment       │
                  └────────┬─────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                 Poor Image    Suitable Image
                    │             │
                    ▼             ▼
                Recapture     AI Pipeline
                                  │
                   ┌──────────────┼──────────────┐
                   │              │              │
                   ▼              ▼              ▼
              DR Grading     Segmentation    Explainability
              EfficientNet       U-Net*         Grad-CAM*
                   │              │              │
                   └──────────────┼──────────────┘
                                  │
                                  ▼
                         Risk Assessment
                                  │
                                  ▼
                         Doctor Validation
                                  │
                         ┌────────┴────────┐
                         │                 │
                         ▼                 ▼
                      Follow-up         Referral
                         │                 │
                         └────────┬────────┘
                                  │
                                  ▼
                           PDF Report
                                  │
                                  ▼
                       Offline Synchronization
                                  │
                                  ▼
                        Cloud Infrastructure

* Experimental components currently under development and integration.

End-to-End Workflow


1. Patient Registration
        ↓
2. Fundus Image Upload
        ↓
3. Image Quality Assessment
        ↓
4. Quality Gate
        ↓
5. AI-Based DR Grading
        ↓
6. Lesion Analysis
        ↓
7. Explainable AI
        ↓
8. Risk Assessment
        ↓
9. Doctor Review
        ↓
10. Referral Decision
        ↓
11. PDF Report
        ↓
12. Patient Follow-up
        ↓
13. Cloud Synchronization
Technology Stack
Frontend
TechnologyPurpose	

Next.js	Web application framework
React	User interface
TypeScript	Type-safe development
Tailwind CSS	UI styling
Backend
TechnologyPurpose	

Python	Backend and AI development
FastAPI	REST API framework
SQLAlchemy	Database ORM
Pydantic	Data validation
JWT	Authentication
ReportLab	PDF report generation
AI and Computer Vision
TechnologyPurpose	

PyTorch	Deep learning framework
Torchvision	Computer vision models and transformations
EfficientNet-B0	Diabetic retinopathy grading
U-Net	Retinal lesion segmentation research
OpenCV	Image processing and quality assessment
Grad-CAM	Explainable AI
Database and Storage
TechnologyPurpose	

SQLite	Local/offline database
PostgreSQL	Cloud database
Local Storage	Images and reports
Cloud Storage	Synchronization and scalable storage
AI Pipeline
Stage 1 — Image Quality Assessment

The system evaluates the quality of an uploaded fundus image before performing disease classification.

The current quality assessment considers:



Resolution
    +
Brightness
    +
Contrast
    +
Sharpness
    +
Retinal Field Coverage
    ↓
Quality Score
    ↓
Good / Borderline / Poor

Poor-quality images are not passed to the grading model.

This quality gate reduces the risk of generating a prediction from an unsuitable input image.

Stage 2 — DR Grading

RetinaCare AI currently uses an EfficientNet-B0 based five-class classification model.

The model predicts:



Grade 0 → No DR
Grade 1 → Mild DR
Grade 2 → Moderate DR
Grade 3 → Severe DR
Grade 4 → Proliferative DR

The grading model is trained using the IDRiD Disease Grading dataset with ImageNet-pretrained EfficientNet-B0 weights.

The official IDRiD testing set is kept separate from the training and validation process.

Stage 3 — Retinal Lesion Segmentation

A U-Net based segmentation pipeline is being developed to identify retinal structures and lesions.

Target classes include:

Microaneurysms
Haemorrhages
Hard Exudates
Soft Exudates
Optic Disc

The segmentation component is currently experimental and requires additional optimization before it can be considered clinically reliable.

Stage 4 — Explainable AI

The planned explainability layer combines model predictions with visual evidence.



AI Prediction
      +
Grad-CAM
      +
Lesion Evidence
      +
Confidence
      ↓
Visual Explanation

The purpose is to provide doctors with interpretable evidence that can support review of the AI-assisted screening result.

Stage 5 — Doctor Validation

The system follows a human-in-the-loop approach.



AI Prediction
      ↓
Visual Evidence
      ↓
Doctor Review
      ↓
Accept / Override
      ↓
Final Clinical Decision

The AI prediction is not treated as the final diagnosis.

A qualified healthcare professional must review and validate the result before clinical action.

Dataset

RetinaCare AI uses publicly available retinal datasets for research and model development.

IDRiD

The Indian Diabetic Retinopathy Image Dataset (IDRiD) is used for:

Diabetic retinopathy grading
Retinal lesion segmentation
Optic disc segmentation
Model evaluation

The disease grading dataset contains five diabetic retinopathy severity levels.

The segmentation dataset provides pixel-level annotations for multiple retinal lesions and the optic disc.

Additional datasets identified for future benchmarking include:

APTOS 2019
Messidor-2
DRIVE

Dataset licenses and usage conditions remain applicable to their respective datasets.

Current Model Evaluation

The project intentionally reports experimental model results rather than presenting unvalidated performance as clinical accuracy.

EfficientNet-B0 Initial Baseline

The initial EfficientNet-B0 model was evaluated on the untouched IDRiD official test set.

MetricResult	

Test Accuracy	56.31%
Macro F1	44.59%
Weighted F1	56.02%
Per-Class Performance
DR GradePrecisionRecallF1	
	
	

No DR	0.64	0.68	0.66
Mild DR	0.00	0.00	0.00
Moderate DR	0.57	0.62	0.60
Severe DR	0.61	0.58	0.59
Proliferative DR	0.50	0.31	0.38

These results represent an initial research baseline.

They are not sufficient to claim clinical deployment readiness.

The model requires further optimization, particularly for minority classes such as Mild and Proliferative DR.

Segmentation Experiment

An initial U-Net segmentation experiment was performed using the IDRiD segmentation dataset.

Best validation result:



Best Validation Mean Dice = 0.2587
Best Epoch = 11

The initial test evaluation showed stronger segmentation performance for hard exudates than several other target classes.

Current segmentation results are therefore treated as an experimental baseline.

Future optimization areas include:

Class imbalance handling
Improved augmentation
Pretrained encoders
Focal/Tversky-based loss functions
Patch-based training
Lesion-specific optimization
Improved generalization across datasets
Application Features
Patient Management
Patient registration
Patient information management
Screening history
Follow-up information
Fundus Screening
Fundus image upload
Image quality assessment
Quality-based recapture guidance
AI-assisted DR grading
Screening result visualization
Doctor Workflow
Doctor review interface
AI result inspection
Visual evidence review
AI result validation
Prediction override
Referral confirmation
Reporting
Automated screening reports
AI assessment summary
Screening information
Doctor validation
Referral information
PDF report generation
Offline Support
Local data storage
Local screening workflow
Offline-first architecture
Synchronization-ready design
Cloud database support
User Roles

RetinaCare AI supports role-based workflows.

Health Worker

Health workers can:

Register patients
Upload fundus images
Perform screening workflows
Review image quality feedback
Manage patient screening information
Initiate referrals
Doctor

Doctors can:

Review AI predictions
Inspect visual evidence
Validate AI results
Override predictions
Confirm referrals
Review patient screening history
Admin

Administrators can manage:

Users
Healthcare facilities
System-level records
Audit information
Platform configuration
Project Structure


RetinaCare-AI/
│
├── ai-models/
│   └── grading/
│       └── efficientnet/
│           └── best_efficientnet_b0.pth
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── explainability/
│   │   │   │   ├── gradcam.py
│   │   │   │   └── visualization.py
│   │   │   │
│   │   │   ├── grading/
│   │   │   │   ├── inference.py
│   │   │   │   └── model.py
│   │   │   │
│   │   │   ├── localization/
│   │   │   ├── preprocessing/
│   │   │   │   ├── image_preprocessing.py
│   │   │   │   └── quality_assessment.py
│   │   │   │
│   │   │   ├── risk/
│   │   │   └── segmentation/
│   │   │
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── storage/
│   │   └── utils/
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── datasets/
│   └── IDRiD/
│
├── training/
│   └── grading/
│
├── docker-compose.yml
├── .gitignore
└── README.md
Local Development
Prerequisites

Install the following:

Python 3.11+
Node.js 18+
npm
Git

Optional:

NVIDIA GPU with a compatible CUDA environment for accelerated model training and inference
Clone the Repository


git clone https://github.com/Vikasnayakar/RetinaCare-AI.git
cd RetinaCare-AI
Backend Setup

Navigate to the backend:



cd backend

Create a Python virtual environment:



python -m venv .venv

Activate the virtual environment:



.venv\Scripts\Activate.ps1

Install backend dependencies:



pip install -r requirements.txt

Start the FastAPI server:



uvicorn app.main:app --reload

The backend will run at:



http://127.0.0.1:8000

FastAPI Swagger documentation:



http://127.0.0.1:8000/docs

Health endpoint:



http://127.0.0.1:8000/health
Frontend Setup

Open another terminal.

Navigate to the frontend:



cd frontend

Install dependencies:



npm install

Start the development server:



npm run dev

The frontend will normally be available at:



http://localhost:3000
Environment Variables

Create the required environment files using the provided .env.example configuration.

Typical backend configuration:



DATABASE_URL=sqlite:///./sih26038.db
SECRET_KEY=CHANGE_THIS_SECRET_KEY
FRONTEND_URL=http://localhost:3000

For production deployments:

Use a strong secret key
Store secrets using environment variables
Do not commit .env files
Use production database credentials
Configure the production frontend URL
Use HTTPS
API Architecture

The backend is organized into modular FastAPI API domains.



/auth
/users
/patients
/screenings
/ai
/doctor-reviews
/referrals
/followups
/reports
/phcs
/sync
/analytics
/audit

This modular architecture separates:

Authentication
Patient management
Screening
AI processing
Doctor validation
Referral management
Follow-up
Reporting
Synchronization
Analytics
Audit logging
Security and Privacy

Because retinal images and patient information may represent sensitive healthcare information, the project incorporates security-oriented design principles.

Current security considerations include:

Authentication
Role-based access
Password hashing
JWT-based authorization
Controlled API access
Audit logging
Environment-based secret management
Separation of datasets and source code
Offline-first data handling

A real-world clinical deployment would additionally require appropriate:

Data encryption
Infrastructure security
Regulatory compliance
Clinical validation
Access governance
Data retention policies
Security testing
Privacy controls
Audit procedures
Offline-First Architecture

One of the core design goals of RetinaCare AI is to support environments with unreliable connectivity.

The conceptual architecture is:



                 Rural Healthcare Facility
                          │
                          ▼
                ┌──────────────────┐
                │ RetinaCare AI    │
                │ Local Application│
                └────────┬─────────┘
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
      Local Patient Data        Local AI
             │                       │
             └───────────┬───────────┘
                         │
                    No Internet
                         │
                    Screening
                    Continues
                         │
                         ▼
                  Internet Returns
                         │
                         ▼
                Synchronization Queue
                         │
                         ▼
                  Cloud Database

This approach reduces dependency on continuous internet access for the core screening workflow.

Cloud Deployment Architecture

The intended production-style architecture is:



                         Internet
                            │
                            ▼
                    ┌──────────────┐
                    │   Vercel     │
                    │  Next.js UI  │
                    └──────┬───────┘
                           │
                          HTTPS
                           │
                           ▼
                    ┌──────────────┐
                    │    Render    │
                    │   FastAPI    │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        PostgreSQL      AI Model      Reports
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                   Cloud Synchronization

The exact production storage architecture will depend on deployment requirements and security considerations.

Design Principles
1. Explainability

AI predictions should be accompanied by interpretable evidence wherever possible.

2. Human Oversight

The system assists healthcare professionals rather than replacing them.

3. Offline First

The screening workflow should remain useful in environments with limited connectivity.

4. Quality Before Prediction

Poor-quality retinal images should be detected before disease classification.

5. Modular Architecture

Frontend, backend, AI, storage, reporting, and synchronization components are designed as modular services.

6. Evidence-Based Development

Model performance is measured using established datasets and evaluation metrics rather than relying on fabricated or unsupported performance claims.

Current Development Status
ComponentStatus	

Patient Registration	✅ Implemented
Patient Management	✅ Implemented
Fundus Image Upload	✅ Implemented
Image Quality Assessment	✅ Implemented
Quality Gate	✅ Implemented
DR Grading Pipeline	✅ Implemented
EfficientNet-B0 Model	🧪 Experimental
Doctor Review Workflow	✅ Implemented
PDF Report Generation	✅ Implemented
Local Storage	✅ Implemented
Offline-First Foundation	✅ Implemented
U-Net Segmentation	🧪 Experimental
Grad-CAM	🚧 Integration in Progress
Lesion-Level Explanation	🚧 In Progress
Advanced Risk Assessment	🚧 In Progress
Cloud Synchronization	🚧 In Progress
Production Deployment	🚧 In Progress
MATLAB / Simulink Workflow	🚧 Planned
Clinical Validation	🚧 Future Work
Roadmap
Phase 1 — Functional Prototype
Patient registration
Fundus image upload
Image quality assessment
Quality gate
AI grading pipeline
Doctor review
PDF reports
Local database
Phase 2 — AI Improvement
Improve DR grading performance
Address class imbalance
Improve Mild DR detection
Improve Proliferative DR detection
Improve referable DR sensitivity
Improve referable DR specificity
Improve segmentation performance
Integrate Grad-CAM
Improve lesion-level evidence
Phase 3 — Clinical Workflow
Enhanced referral prioritization
Follow-up scheduling
Longitudinal screening history
Doctor feedback loop
Clinical validation workflow
Phase 4 — Rural Deployment
Robust synchronization queue
Cloud database deployment
PHC-level deployment
Scalable infrastructure
Monitoring and audit infrastructure
Phase 5 — MATLAB / Simulink Alignment
Image acquisition simulation
Image processing throughput simulation
Network bandwidth modelling
Doctor review capacity modelling
Resource allocation simulation
District-scale screening workflow simulation
Research Direction

The long-term objective of RetinaCare AI is to move beyond a standalone disease classifier toward a complete explainable, human-in-the-loop screening system.



Image Quality
      ↓
Robust DR Grading
      ↓
Lesion-Level Evidence
      ↓
Explainability
      ↓
Calibrated Confidence
      ↓
Risk Assessment
      ↓
Doctor Validation
      ↓
Referral Prioritization
      ↓
Patient Follow-up
      ↓
Offline + Cloud Continuity

The research direction focuses on combining these components into a unified screening workflow suitable for resource-constrained healthcare environments.

Limitations

RetinaCare AI is currently an academic research and prototype system.

Important limitations include:

The current DR grading model is not clinically validated.
The initial grading model has limited performance on minority classes.
Mild DR detection requires significant improvement.
Proliferative DR recall requires further improvement.
Initial U-Net segmentation performance is inconsistent across lesion classes.
Explainability components are still under integration.
Clinical validation has not yet been completed.
The current system should not be used to make independent medical decisions.
Production deployment requires appropriate security, privacy, regulatory, and clinical validation processes.
Smart India Hackathon Alignment

Problem Statement: SIH26038

Title: Explainable AI for Diabetic Retinopathy Screening in Rural India

Theme: MedTech / BioTech / HealthTech

Organization: MathWorks

RetinaCare AI addresses the problem statement through:

RequirementRetinaCare AI Approach	

Image Quality Assessment	Automated quality scoring and recapture guidance
Image Enhancement	Preprocessing and normalization pipeline
DR Grading	EfficientNet-B0 five-class classification
Lesion Analysis	U-Net segmentation research pipeline
Explainability	Grad-CAM and lesion-level evidence
Confidence	Model confidence included with predictions
Doctor Validation	Human-in-the-loop review workflow
Rural Connectivity	Offline-first architecture
Reporting	Automated PDF reports
Follow-up	Referral and follow-up workflow
Scalability	Cloud-ready architecture
Simulation	MATLAB / Simulink workflow planned
Why RetinaCare AI?

The core innovation is not simply using deep learning to classify retinal images.

The project combines:



Image Quality Gating
        +
AI-Based DR Grading
        +
Lesion Analysis
        +
Explainable AI
        +
Doctor Validation
        +
Offline-First Architecture
        +
Referral Management
        +
Follow-up
        +
Cloud Synchronization

This creates a complete screening-oriented workflow rather than an isolated AI classifier.

References
Porwal, P. et al. (2018).
Indian Diabetic Retinopathy Image Dataset (IDRiD): A Database for Diabetic Retinopathy Screening Research.
Data, 3(3), 25.
https://doi.org/10.3390/data3030025
Porwal, P. et al. (2020).
Indian Diabetic Retinopathy Image Dataset (IDRiD): A Database for Diabetic Retinopathy Screening Research.
Medical Image Analysis, 59, 101561.
https://doi.org/10.1016/j.media.2019.101561
Gulshan, V. et al. (2016).
Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs.
JAMA, 316(22), 2402–2410.
https://doi.org/10.1001/jama.2016.17216
Gulshan, V. et al. (2019).
Performance of a Deep-Learning Algorithm vs Manual Grading for Detecting Diabetic Retinopathy in India.
JAMA Ophthalmology, 137(9), 987–993.
https://doi.org/10.1001/jamaophthalmol.2019.0556
Natarajan, S. et al. (2019).
Evaluation of an Artificial Intelligence–Based Screening Tool for Diabetic Retinopathy in a Primary Care Setting.
JAMA Ophthalmology.
https://doi.org/10.1001/jamaophthalmol.2019.1805
Rahaman, M. M. et al. (2026).
Explainable Artificial Intelligence for Diabetic Retinopathy Detection Using Vision Transformers.
Scientific Reports.
https://doi.org/10.1038/s41598-026-56569-4
Acknowledgement

This project is developed as part of the Smart India Hackathon (SIH) 2026 for problem statement SIH26038 — Explainable AI for Diabetic Retinopathy Screening in Rural India.

The project uses publicly available retinal datasets and open-source software frameworks for research and prototype development.

Disclaimer

RetinaCare AI is an academic research prototype and clinical decision-support system. It is not a medical device and must not be used as a substitute for examination, diagnosis, or treatment by a qualified healthcare professional.

The AI predictions presented by the current prototype are experimental and require appropriate clinical validation before any real-world medical deployment.

License

This repository is intended primarily for academic and research purposes.

Dataset licenses and third-party software licenses remain applicable to their respective components.

Users are responsible for complying with the licensing terms of all external datasets, libraries, pretrained models, and resources used with this project.

Project Information

Project: RetinaCare AI

Problem Statement: SIH26038

Domain: MedTech / BioTech / HealthTech

Focus: Explainable AI for Diabetic Retinopathy Screening

Target Environment: Rural and Resource-Constrained Healthcare

Frontend: Next.js + React + TypeScript

Backend: FastAPI + Python

AI: PyTorch + EfficientNet-B0 + U-Net

Computer Vision: OpenCV

Database: SQLite / PostgreSQL

Reporting: ReportLab

Deployment: Cloud-ready / Offline-first

Built for Smarter, Explainable and Accessible Retinal Screening

RetinaCare AI — Screen Early. Explain Clearly. Refer on Time.
